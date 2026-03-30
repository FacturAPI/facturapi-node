import {
  SearchResult,
  Webhook,
  ApiEvent,
  ApiEventType,
} from '../types';
import { WrapperClient } from '../wrapper';

function hasBuffer(): boolean {
  return typeof Buffer !== 'undefined';
}

function hasWebCryptoSubtle(): boolean {
  return (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.subtle !== 'undefined'
  );
}

function signatureHexToBytes(signature: string): Uint8Array | null {
  if (signature.length % 2 !== 0) return null;
  if (!/^[0-9a-fA-F]+$/.test(signature)) return null;
  const bytes = new Uint8Array(signature.length / 2);
  for (let i = 0; i < signature.length; i += 2) {
    bytes[i / 2] = parseInt(signature.slice(i, i + 2), 16);
  }
  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

export default class Webhooks {
  client: WrapperClient;

  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Creates a new webhook in your organization
   * @param data - Webhook options
   * @returns Webhook object
   */
  create(data: Record<string, any>): Promise<Webhook> {
    return this.client.post('/webhooks', { body: data });
  }

  /**
   * Gets a paginated list of webhooks that belong to your organization
   * @param params - Search parameters
   * @returns Search results object. The object contains a `data` property with the list of webhooks.
   */
  list(params: Record<string, any>): Promise<SearchResult<Webhook>> {
    if (!params) {
      params = {};
    }
    return this.client.get('/webhooks', { params });
  }

  /**
   * Gets a single webhook object
   * @param id - Webhook Id
   * @returns Webhook object
   */
  retrieve(id: string): Promise<Webhook> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/webhooks/' + id);
  }

  /**
   * Updates a webhook
   * @param id - Webhook Id
   * @param data Updated webhook data
   * @returns
   */
  update(id: string, data: Record<string, any>): Promise<Webhook> {
    return this.client.put('/webhooks/' + id, { body: data });
  }

  /**
   * Permanently removes a webhook from your organization.
   * @param id - Webhook Id
   * @returns Deleted webhook
   */
  del(id: string): Promise<Webhook> {
    return this.client.delete('/webhooks/' + id);
  }

  /**
   * Validate the response of webhook with the secret and facturapi-signature
   * @param secret - Webhook Secret, received in the webhook creation
   * @param signature - Facturapi Signature Header
   * @param payload - Received event object to validate
   * @returns When the signature is valid, it returns the event object
   */
  async validateSignature<T extends ApiEventType = any>(data: {
    secret: string;
    signature: string;
    payload: string | Uint8Array | ArrayBuffer | ApiEvent<T>;
  }): Promise<ApiEvent<T>> {
    // Validated locally
    const { secret, signature, payload } = data;
    let payloadString: string;
    if (typeof payload === 'string') {
      payloadString = payload;
    } else if (payload instanceof Uint8Array) {
      payloadString = new TextDecoder().decode(payload);
    } else if (payload instanceof ArrayBuffer) {
      payloadString = new TextDecoder().decode(new Uint8Array(payload));
    } else if (
      typeof Buffer !== 'undefined' &&
      Buffer.isBuffer(payload)
    ) {
      payloadString = payload.toString('utf8');
    } else if (typeof payload === 'object') {
      payloadString = JSON.stringify(payload);
    } else {
      throw new Error('Invalid payload type');
    }

    if (hasBuffer()) {
      let nodeCrypto: typeof import('crypto') | null = null;
      try {
        nodeCrypto = await import('crypto');
      } catch (e) {
        // continue to other available validators
      }

      if (nodeCrypto) {
        const hmac = nodeCrypto.createHmac('sha256', secret);
        const digestBuffer = hmac
          .update(payloadString)
          .digest();
        // Compare the digest with the signature and prevent timing attacks
        // by using a constant-time comparison
        const signatureBuffer = Buffer.from(signature, 'hex');
        if (digestBuffer.length !== signatureBuffer.length) {
          throw new Error('Invalid signature');
        }
        const isValid = nodeCrypto.timingSafeEqual(
          digestBuffer,
          signatureBuffer,
        );
        if (!isValid) {
          throw new Error('Invalid signature');
        }
        return JSON.parse(payloadString) as ApiEvent<T>;
      }
    }

    if (hasWebCryptoSubtle()) {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(payloadString);
      const encodedSecret = encoder.encode(secret);
      const signatureBytes = signatureHexToBytes(signature);
      if (!signatureBytes) {
        throw new Error('Invalid signature');
      }
      const key = await globalThis.crypto.subtle.importKey(
        'raw',
        encodedSecret,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify'],
      );
      const isValid = await globalThis.crypto.subtle.verify(
        'HMAC',
        key,
        toArrayBuffer(signatureBytes),
        encodedData,
      );
      if (!isValid) {
        throw new Error('Invalid signature');
      }
      return JSON.parse(payloadString) as ApiEvent<T>;
    }

    // Fallback for runtimes without local crypto support (e.g. some RN setups)
    return this.client.post('/webhooks/validate-signature', {
      body: {
        secret,
        signature,
        payload: payloadString,
      },
    });
  }
}
