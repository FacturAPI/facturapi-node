import type { ApiEvent, ApiEventPayload, ApiEventType } from '../types'
import { deserializeResponseDates, type WrapperClient } from '../wrapper'
import { componentDatePlans } from '../generated/dates'

function hasBuffer(): boolean {
  return typeof Buffer !== 'undefined'
}

function hasWebCryptoSubtle(): boolean {
  return (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.subtle !== 'undefined'
  )
}

function signatureHexToBytes(signature: string): Uint8Array | null {
  if (signature.length % 2 !== 0) return null
  if (!/^[0-9a-fA-F]+$/.test(signature)) return null
  const bytes = new Uint8Array(signature.length / 2)
  for (let i = 0; i < signature.length; i += 2) {
    bytes[i / 2] = parseInt(signature.slice(i, i + 2), 16)
  }
  return bytes
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
}

function parseEvent<T extends ApiEventType>(payload: string): ApiEvent<T> {
  let event: unknown
  try {
    event = JSON.parse(payload)
  } catch {
    throw new Error('Invalid webhook event JSON')
  }
  return deserializeResponseDates(
    event,
    componentDatePlans.ApiEvent,
  ) as ApiEvent<T>
}

export async function validateSignature<T extends ApiEventType = any>(
  client: WrapperClient,
  data: {
    secret: string
    signature: string
    payload: string | Uint8Array | ArrayBuffer | ApiEventPayload<T>
  },
): Promise<ApiEvent<T>> {
  // Validated locally
  const { secret, signature, payload } = data
  let payloadString: string
  if (typeof payload === 'string') {
    payloadString = payload
  } else if (payload instanceof Uint8Array) {
    payloadString = new TextDecoder().decode(payload)
  } else if (payload instanceof ArrayBuffer) {
    payloadString = new TextDecoder().decode(new Uint8Array(payload))
  } else if (typeof payload === 'object') {
    payloadString = JSON.stringify(payload)
  } else {
    throw new Error('Invalid payload type')
  }

  if (hasBuffer()) {
    let nodeCrypto: typeof import('crypto') | null = null
    try {
      nodeCrypto = await import('crypto')
    } catch (e) {
      // continue to other available validators
    }

    if (nodeCrypto) {
      const hmac = nodeCrypto.createHmac('sha256', secret)
      const digestBuffer = hmac.update(payloadString).digest()
      // Compare the digest with the signature and prevent timing attacks
      // by using a constant-time comparison
      const signatureBuffer = Buffer.from(signature, 'hex')
      if (digestBuffer.length !== signatureBuffer.length) {
        throw new Error('Invalid signature')
      }
      const isValid = nodeCrypto.timingSafeEqual(digestBuffer, signatureBuffer)
      if (!isValid) {
        throw new Error('Invalid signature')
      }
      return parseEvent<T>(payloadString)
    }
  }

  if (hasWebCryptoSubtle()) {
    const encoder = new TextEncoder()
    const encodedData = encoder.encode(payloadString)
    const encodedSecret = encoder.encode(secret)
    const signatureBytes = signatureHexToBytes(signature)
    if (!signatureBytes) {
      throw new Error('Invalid signature')
    }
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      encodedSecret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      toArrayBuffer(signatureBytes),
      encodedData,
    )
    if (!isValid) {
      throw new Error('Invalid signature')
    }
    return parseEvent<T>(payloadString)
  }

  // Fallback for runtimes without local crypto support (e.g. some RN setups)
  await client.post('/webhooks/validate-signature', {
    body: {
      secret,
      signature,
      payload: payloadString,
    },
  })
  return parseEvent<T>(payloadString)
}
