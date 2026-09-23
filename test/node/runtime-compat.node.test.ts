import crypto from 'node:crypto'
import { Writable } from 'node:stream'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Facturapi, { FacturapiError } from '../../src'

const originalFetch = globalThis.fetch

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
  vi.restoreAllMocks()
})

describe('runtime compatibility (node)', () => {
  it('sends bearer auth header in Node', async () => {
    const client = createClient()
    const expected = 'Bearer sk_test_123'

    globalThis.fetch = vi.fn(async (_url, options) => {
      expect(getHeader(options?.headers, 'Authorization')).toBe(expected)
      return new Response(JSON.stringify({ id: 'inv_123' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    await client.invoices.retrieve('inv_123')
  })

  it('sends custom headers in Node', async () => {
    const client = new Facturapi('sk_test_123', {
      headers: {
        'x-facturapi-client': 'MCP',
        authorization: 'Bearer ignored',
        'content-type': 'text/plain',
      },
    })
    client.BASE_URL = 'https://api.test.local/v2'

    globalThis.fetch = vi.fn(async (_url, options) => {
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      )
      expect(getHeader(options?.headers, 'x-facturapi-client')).toBe('MCP')
      expect(getHeader(options?.headers, 'Content-Type')).toBe(
        'application/json',
      )

      return new Response(JSON.stringify({ id: 'org_123' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    await client.organizations.me()
  })

  it('parses JSON responses and sends auth header', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe('https://api.test.local/v2/invoices/inv_123')
      expect(options?.method).toBe('GET')
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      )
      expect(getHeader(options?.headers, 'Content-Type')).toBe(
        'application/json',
      )

      return new Response(
        JSON.stringify({
          id: 'inv_123',
          object: 'invoice',
          created_at: '2026-09-17T12:00:00.000Z',
          date: '2026-09-17T11:00:00.000Z',
          canceled_at: '2026-09-17T12:59:16.000Z',
          cancellation: {
            requested_at: '2026-09-17T12:59:16.000Z',
            last_checked: '2026-09-17T13:00:00.000Z',
          },
          stamp: {
            date: '2026-09-17T06:59:16',
          },
          metadata: {
            date: '2026-09-17T12:00:00.000Z',
          },
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      )
    }) as typeof fetch

    const invoice = await client.invoices.retrieve('inv_123')
    expect(invoice.id).toBe('inv_123')
    expect(invoice.created_at).toEqual(new Date('2026-09-17T12:00:00.000Z'))
    expect(invoice.date).toEqual(new Date('2026-09-17T11:00:00.000Z'))
    expect(invoice.canceled_at).toEqual(new Date('2026-09-17T12:59:16.000Z'))
    expect(invoice.cancellation?.requested_at).toEqual(
      new Date('2026-09-17T12:59:16.000Z'),
    )
    expect(invoice.cancellation?.last_checked).toEqual(
      new Date('2026-09-17T13:00:00.000Z'),
    )
    expect(invoice.stamp?.date).toBe('2026-09-17T06:59:16')
    expect((invoice as any).metadata.date).toBe('2026-09-17T12:00:00.000Z')
  })

  it('checks domain availability via GET query params', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/organizations/domain-check?domain=empresa-demo',
      )
      expect(options?.method).toBe('GET')
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      )

      return new Response(JSON.stringify({ available: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    const result = await client.organizations.checkDomainIsAvailable({
      domain: 'empresa-demo',
    })

    expect(result.available).toBe(true)
  })

  it('hydrates organization access, invite, role, and API key timestamps', async () => {
    const client = createClient()
    const timestamp = '2026-09-17T12:00:00.000Z'
    globalThis.fetch = vi.fn(async (url) =>
      Response.json(
        String(url).endsWith('/team')
          ? [{ id: 'access_123', created_at: timestamp, updated_at: timestamp }]
          : String(url).endsWith('/team/invites')
            ? [{ id: 'invite_123', created_at: timestamp, expires_at: timestamp }]
            : String(url).endsWith('/team/roles')
              ? [{ id: 'role_123', created_at: timestamp, updated_at: timestamp }]
              : [{ id: 'key_123', created_at: timestamp }],
      ),
    ) as typeof fetch

    const access = await client.organizations.listTeamAccess('org_123')
    expect(access[0].created_at).toEqual(new Date(timestamp))
    expect(access[0].updated_at).toEqual(new Date(timestamp))
    const invites = await client.organizations.listSentTeamInvites('org_123')
    expect(invites[0].created_at).toEqual(new Date(timestamp))
    expect(invites[0].expires_at).toEqual(new Date(timestamp))
    const roles = await client.organizations.listTeamRoles('org_123')
    expect(roles[0].created_at).toEqual(new Date(timestamp))
    expect(roles[0].updated_at).toEqual(new Date(timestamp))
    expect((await client.organizations.listLiveApiKeys('org_123'))[0].created_at)
      .toEqual(new Date(timestamp))
  })

  it('hydrates dates across resource responses without changing SAT stamp text', async () => {
    const client = createClient()
    const timestamp = '2026-09-17T12:00:00.000Z'
    const responses: Record<string, unknown> = {
      '/v2/customers/cus_123': {
        created_at: timestamp,
        sat_validated_at: timestamp,
        edit_link_expires_at: timestamp,
      },
      '/v2/products/prod_123': { created_at: timestamp },
      '/v2/receipts/rec_123': {
        created_at: timestamp,
        date: timestamp,
        expires_at: timestamp,
      },
      '/v2/retentions/ret_123': {
        created_at: timestamp,
        fecha_exp: timestamp,
        stamp: { date: '2026-09-17T06:00:00' },
      },
      '/v2/organizations/me': {
        created_at: timestamp,
        certificate: { updated_at: timestamp, expires_at: timestamp },
        pending_add_ons_update: { add_ons: [], scheduled_for: timestamp },
      },
      '/v2/webhooks/wh_123': { created_at: timestamp },
      '/v2/invoices/zip-requests/zip_123': {
        created_at: timestamp,
        updated_at: timestamp,
      },
    }
    globalThis.fetch = vi.fn(async (url) =>
      Response.json(responses[new URL(String(url)).pathname]),
    ) as typeof fetch

    const customer = await client.customers.retrieve('cus_123')
    expect(customer.created_at).toEqual(new Date(timestamp))
    expect(customer.sat_validated_at).toEqual(new Date(timestamp))
    expect(customer.edit_link_expires_at).toEqual(new Date(timestamp))
    expect((await client.products.retrieve('prod_123')).created_at).toEqual(
      new Date(timestamp),
    )
    const receipt = await client.receipts.retrieve('rec_123')
    expect(receipt.created_at).toEqual(new Date(timestamp))
    expect(receipt.date).toEqual(new Date(timestamp))
    expect(receipt.expires_at).toEqual(new Date(timestamp))
    const retention = await client.retentions.retrieve('ret_123')
    expect(retention.created_at).toEqual(new Date(timestamp))
    expect(retention.fecha_exp).toEqual(new Date(timestamp))
    expect(retention.stamp?.date).toBe('2026-09-17T06:00:00')
    const organization = await client.organizations.me()
    expect(organization.created_at).toEqual(new Date(timestamp))
    expect(organization.certificate.updated_at).toEqual(new Date(timestamp))
    expect(organization.certificate.expires_at).toEqual(new Date(timestamp))
    expect(organization.pending_add_ons_update?.scheduled_for).toEqual(
      new Date(timestamp),
    )
    expect((await client.webhooks.retrieve('wh_123')).created_at).toEqual(
      new Date(timestamp),
    )
    const zipRequest = await client.invoices.retrieveZipRequest('zip_123')
    expect(zipRequest.created_at).toEqual(new Date(timestamp))
    expect(zipRequest.updated_at).toEqual(new Date(timestamp))
  })

  it('posts multiple receipts to invoice payload to receipts endpoint', async () => {
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

  it('downloads multiple receipts to invoice preview pdf', async () => {
    const client = createClient()
    const payload = {
      keys: ['rcp_key_1'],
      use: 'G03',
    }

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/receipts/to-invoice/preview',
      )
      expect(options?.method).toBe('POST')
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      )
      expect(getHeader(options?.headers, 'Content-Type')).toBe(
        'application/json',
      )
      expect(options?.body).toBe(JSON.stringify(payload))

      return new Response(new Blob([Buffer.from('pdf-binary-content')]), {
        status: 200,
        headers: { 'content-type': 'application/pdf' },
      })
    }) as typeof fetch

    const pdf = await client.receipts.previewToInvoicePdf(payload)

    expect(pdf instanceof Blob).toBe(false)
    expect(typeof (pdf as any).pipe).toBe('function')

    const chunks: Buffer[] = []
    await new Promise<void>((resolve, reject) => {
      ;(pdf as any).on('data', (chunk: unknown) => {
        chunks.push(Buffer.from(chunk as Uint8Array))
      })
      ;(pdf as any).on('error', reject)
      ;(pdf as any).on('end', resolve)
    })

    expect(Buffer.concat(chunks).toString('utf8')).toBe('pdf-binary-content')
  })

  it('surfaces API message from non-OK JSON responses', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          message: 'invoice not found',
        }),
        {
          status: 404,
          headers: { 'content-type': 'application/json' },
        },
      )
    }) as typeof fetch

    await expect(client.invoices.retrieve('inv_123')).rejects.toThrow(
      'invoice not found',
    )
  })

  it('surfaces structured API errors and response headers in Node', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          message: 'Se excedió el límite de solicitudes.',
          status: 429,
          code: 'RATE_LIMIT_EXCEEDED',
          path: 'date',
          location: 'query',
          errors: [
            {
              code: 'required',
              message: '"date" is required',
              path: 'date',
              location: 'query',
            },
          ],
        }),
        {
          status: 429,
          headers: {
            'content-type': 'application/json',
            'retry-after': '3',
            'x-facturapi-log-id': 'log_123',
          },
        },
      )
    }) as typeof fetch

    try {
      await client.invoices.retrieve('inv_123')
      throw new Error('Expected request to fail')
    } catch (error) {
      expect(error).toBeInstanceOf(FacturapiError)
      expect((error as FacturapiError).message).toBe(
        'Se excedió el límite de solicitudes.',
      )
      expect((error as FacturapiError).status).toBe(429)
      expect((error as FacturapiError).code).toBe('RATE_LIMIT_EXCEEDED')
      expect((error as FacturapiError).path).toBe('date')
      expect((error as FacturapiError).location).toBe('query')
      expect((error as FacturapiError).logId).toBe('log_123')
      expect((error as FacturapiError).errors).toEqual([
        {
          code: 'required',
          message: '"date" is required',
          path: 'date',
          location: 'query',
        },
      ])
      expect((error as FacturapiError).headers['retry-after']).toBe('3')
      expect((error as FacturapiError).headers['x-facturapi-log-id']).toBe(
        'log_123',
      )
    }
  })

  it('falls back to raw text when non-OK JSON body is malformed', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async () => {
      return new Response('not-a-json-body', {
        status: 500,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    await expect(client.invoices.retrieve('inv_123')).rejects.toThrow(
      'not-a-json-body',
    )
  })

  it('falls back to status text when non-OK body is empty', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async () => {
      return new Response('', {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'content-type': 'text/plain' },
      })
    }) as typeof fetch

    await expect(client.invoices.retrieve('inv_123')).rejects.toThrow(
      'Bad Request',
    )
  })

  it('returns a pipeable stream-like object for binary downloads', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async () => {
      return new Response(new Blob([Buffer.from('zip-binary-content')]), {
        status: 200,
        headers: { 'content-type': 'application/zip' },
      })
    }) as typeof fetch

    const zip = await client.invoices.downloadZip('inv_123')

    expect(zip instanceof Blob).toBe(false)
    expect(typeof (zip as any).pipe).toBe('function')

    const chunks: Buffer[] = []
    await new Promise<void>((resolve, reject) => {
      ;(zip as any).on('data', (chunk: unknown) => {
        chunks.push(Buffer.from(chunk as Uint8Array))
      })
      ;(zip as any).on('error', reject)
      ;(zip as any).on('end', resolve)
    })

    expect(Buffer.concat(chunks).toString('utf8')).toBe('zip-binary-content')
  })

  it('pipes binary downloads to a Node writable stream', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async () => {
      return new Response(new Blob([Buffer.from('zip-binary-content')]), {
        status: 200,
        headers: { 'content-type': 'application/zip' },
      })
    }) as typeof fetch

    const zip = await client.invoices.downloadZip('inv_123')

    const written: Buffer[] = []
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        written.push(Buffer.from(chunk))
        callback()
      },
    })

    await new Promise<void>((resolve, reject) => {
      writable.on('finish', resolve)
      writable.on('error', reject)
      ;(zip as any).on('error', reject)
      ;(zip as any).pipe(writable)
    })

    expect(Buffer.concat(written).toString('utf8')).toBe('zip-binary-content')
  })

  it('propagates stream reader errors for binary downloads', async () => {
    const client = createClient()

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
        body: {
          getReader() {
            return {
              read: async () => {
                throw new Error('reader failed')
              },
              cancel: async () => undefined,
            }
          },
        },
        async blob() {
          return new Blob(['fallback'])
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
    await expect(
      new Promise((resolve, reject) => {
        ;(zip as any).on('error', reject)
        ;(zip as any).on('end', resolve)
        ;(zip as any).on('close', resolve)
        ;(zip as any).on('data', () => undefined)
      }),
    ).rejects.toThrow('reader failed')
  })

  it('validates webhook signatures locally in Node crypto', async () => {
    const client = createClient()
    const payload = '{"id":"evt_123","type":"invoice.created"}'
    const secret = 'whsec_test_fixed'
    const precomputedSignature =
      'cebe006de72ff7836e0a39b2dcb7c6304f27039441ae21b52fba413f24516d6e'

    const event = await client.webhooks.validateSignature({
      secret,
      signature: precomputedSignature,
      payload,
    })

    expect(event.id).toBe('evt_123')
    expect(event.type).toBe('invoice.created')

    await expect(
      client.webhooks.validateSignature({
        secret,
        signature: crypto
          .createHmac('sha256', 'different_secret')
          .update(payload)
          .digest('hex'),
        payload,
      }),
    ).rejects.toThrow('Invalid signature')
  })

  it('hydrates dates in locally validated webhook events', async () => {
    const client = createClient()
    const secret = 'whsec_test_dates'
    const payload = JSON.stringify({
      created_at: '2026-09-17T12:00:00.000Z',
      data: {
        type: 'invoice',
        object: {
          created_at: '2026-09-17T11:00:00.000Z',
          cancellation: { requested_at: '2026-09-17T12:59:16.000Z' },
          stamp: { date: '2026-09-17T06:59:16' },
        },
      },
    })

    const event = await client.webhooks.validateSignature({
      secret,
      signature: crypto.createHmac('sha256', secret).update(payload).digest('hex'),
      payload,
    })

    expect(event.created_at).toEqual(new Date('2026-09-17T12:00:00.000Z'))
    expect(event.data.object.created_at).toEqual(
      new Date('2026-09-17T11:00:00.000Z'),
    )
    expect(event.data.object.cancellation?.requested_at).toEqual(
      new Date('2026-09-17T12:59:16.000Z'),
    )
    expect(event.data.object.stamp?.date).toBe('2026-09-17T06:59:16')
  })

  it('falls back to API validation when local crypto is unavailable', async () => {
    const client = createClient()
    const originalBuffer = (globalThis as any).Buffer
    const cryptoDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'crypto',
    )

    ;(globalThis as any).Buffer = undefined
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe('https://api.test.local/v2/webhooks/validate-signature')
      expect(options?.method).toBe('POST')
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
          return {
            id: 'evt_remote_123',
            type: 'invoice.created',
          }
        },
        async text() {
          return ''
        },
      } as unknown as Response
    }) as typeof fetch

    try {
      const event = await client.webhooks.validateSignature({
        secret: 'whsec_test',
        signature: 'deadbeef',
        payload: '{"id":"evt_remote_123","type":"invoice.created"}',
      })
      expect(event.id).toBe('evt_remote_123')
      expect(event.type).toBe('invoice.created')
    } finally {
      ;(globalThis as any).Buffer = originalBuffer
      if (cryptoDescriptor) {
        Object.defineProperty(globalThis, 'crypto', cryptoDescriptor)
      }
    }
  })

  it('rejects unsupported upload inputs with a clear error', async () => {
    const client = createClient()
    await expect(
      client.organizations.uploadLogo('org_123', { invalid: true } as any),
    ).rejects.toThrow(/Unsupported file input type/)
  })

  it('serializes flat params with URLSearchParams encoding and arrays with repeated keys', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices?search=a+b&page=2&active=true&empty=&tags=x&tags=y',
      )
      return new Response(
        JSON.stringify({
          data: [],
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      )
    }) as typeof fetch

    await client.invoices.list({
      search: 'a b',
      page: 2,
      active: true,
      empty: '',
      tags: ['x', 'y'] as unknown as string,
    })
  })
})
