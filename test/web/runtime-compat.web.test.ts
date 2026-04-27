import { afterEach, describe, expect, it, vi } from 'vitest'

import Facturapi from '../../src'

const originalFetch = globalThis.fetch
const originalBuffer = (globalThis as any).Buffer

function createClient() {
  const client = new Facturapi('sk_test_123')
  client.BASE_URL = 'https://api.test.local/v2'
  return client
}

function getHeader(
  headers: HeadersInit | undefined,
  name: string,
): string | undefined {
  if (!headers) return undefined
  if (headers instanceof Headers) return headers.get(name) || undefined
  if (Array.isArray(headers)) {
    const match = headers.find(
      ([key]) => key.toLowerCase() === name.toLowerCase(),
    )
    return match?.[1]
  }
  const map = headers as Record<string, string>
  return map[name] || map[name.toLowerCase()]
}

afterEach(() => {
  globalThis.fetch = originalFetch
  ;(globalThis as any).Buffer = originalBuffer
  vi.restoreAllMocks()
})

describe('runtime compatibility (web simulation)', () => {
  it('sends bearer auth header in web-like runtime', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (_url, options) => {
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      )
      return {
        ok: true,
        headers: {
          get(name: string) {
            return name.toLowerCase() === 'content-type'
              ? 'application/json'
              : null
          },
        },
        async json() {
          return { id: 'inv_123' }
        },
        async text() {
          return ''
        },
      } as unknown as Response
    }) as typeof fetch

    await client.invoices.retrieve('inv_123')
  })

  it('surfaces API message from non-OK JSON responses in web-sim', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async () => {
      return {
        ok: false,
        statusText: 'Not Found',
        headers: {
          get(name: string) {
            return name.toLowerCase() === 'content-type'
              ? 'application/json'
              : null
          },
        },
        async text() {
          return '{"message":"invoice not found"}'
        },
      } as unknown as Response
    }) as typeof fetch

    await expect(client.invoices.retrieve('inv_123')).rejects.toThrow(
      'invoice not found',
    )
  })

  it('posts multiple receipts to invoice payload in web-like runtime', async () => {
    const client = createClient()
    const payload = {
      keys: ['rcp_key_1', 'rcp_key_2'],
      dry_run: true,
      use: 'G03',
    }

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe('https://api.test.local/v2/receipts/to-invoice')
      expect(options?.method).toBe('POST')
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      )
      expect(getHeader(options?.headers, 'Content-Type')).toBe(
        'application/json',
      )
      expect(options?.body).toBe(JSON.stringify(payload))

      return new Response(JSON.stringify({ total: 1234 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    const result = await client.receipts.toInvoice(payload)
    expect((result as Record<string, unknown>).total).toBe(1234)
  })

  it('returns Blob receipts to-invoice preview pdf in web-like runtime', async () => {
    const client = createClient()
    ;(globalThis as any).Buffer = undefined
    const payload = {
      keys: ['rcp_key_1'],
      use: 'G03',
    }

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/receipts/to-invoice/preview/pdf',
      )
      expect(options?.method).toBe('POST')
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      )
      expect(getHeader(options?.headers, 'Content-Type')).toBe(
        'application/json',
      )
      expect(options?.body).toBe(JSON.stringify(payload))

      return {
        ok: true,
        headers: {
          get(name: string) {
            return name.toLowerCase() === 'content-type'
              ? 'application/pdf'
              : null
          },
        },
        body: undefined,
        async blob() {
          return new Blob(['pdf-binary-content'])
        },
        async json() {
          return {}
        },
        async text() {
          return ''
        },
      } as unknown as Response
    }) as typeof fetch

    const pdf = await client.receipts.previewToInvoicePdf(payload)
    expect(pdf instanceof Blob).toBe(true)
    expect(await (pdf as Blob).text()).toBe('pdf-binary-content')
  })

  it('falls back to raw text on malformed JSON error bodies in web-sim', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async () => {
      return {
        ok: false,
        statusText: 'Internal Server Error',
        headers: {
          get(name: string) {
            return name.toLowerCase() === 'content-type'
              ? 'application/json'
              : null
          },
        },
        async text() {
          return 'not-a-json-body'
        },
      } as unknown as Response
    }) as typeof fetch

    await expect(client.invoices.retrieve('inv_123')).rejects.toThrow(
      'not-a-json-body',
    )
  })

  it('returns Blob for binary downloads when Buffer is unavailable', async () => {
    const client = createClient()
    ;(globalThis as any).Buffer = undefined

    globalThis.fetch = vi.fn(async () => {
      return {
        ok: true,
        headers: {
          get(name: string) {
            return name.toLowerCase() === 'content-type'
              ? 'application/zip'
              : null
          },
        },
        body: undefined,
        async blob() {
          return new Blob(['zip-binary-content'])
        },
        async json() {
          return {}
        },
        async text() {
          return ''
        },
      } as unknown as Response
    }) as typeof fetch

    const zip = await client.invoices.downloadZip('inv_123')
    expect(zip instanceof Blob).toBe(true)
    expect(await (zip as Blob).text()).toBe('zip-binary-content')
  })

  it('sends multipart FormData without forcing content-type header', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe('https://api.test.local/v2/organizations/org_123/logo')
      expect(options?.method).toBe('PUT')
      expect(options?.body instanceof FormData).toBe(true)
      expect(getHeader(options?.headers, 'Content-Type')).toBeUndefined()
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      )

      return new Response(
        JSON.stringify({
          id: 'org_123',
          object: 'organization',
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      )
    }) as typeof fetch

    const organization = await client.organizations.uploadLogo(
      'org_123',
      new Uint8Array([1, 2, 3]),
    )

    expect(organization.id).toBe('org_123')
  })

  it('validates webhook signatures through WebCrypto path', async () => {
    const client = createClient()
    ;(globalThis as any).Buffer = undefined

    const payload = '{"id":"evt_web_123","type":"invoice.created"}'
    const secret = 'whsec_web_fixed'
    const precomputedSignature =
      'adffbea89398760c226a664f8e14d9e66b5105b84dabe8a2868638c650b05721'

    const event = await client.webhooks.validateSignature({
      secret,
      signature: precomputedSignature,
      payload,
    })

    expect(event.id).toBe('evt_web_123')
    expect(event.type).toBe('invoice.created')

    await expect(
      client.webhooks.validateSignature({
        secret,
        signature: 'deadbeef',
        payload,
      }),
    ).rejects.toThrow('Invalid signature')
  })
})
