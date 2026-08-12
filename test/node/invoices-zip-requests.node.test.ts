import { afterEach, describe, expect, it, vi } from 'vitest'

import Facturapi, { InvoiceType, IssuingType } from '../../src'

const originalFetch = globalThis.fetch

function createClient() {
  const client = new Facturapi('sk_test_123')
  client.BASE_URL = 'https://api.test.local/v2'
  return client
}

afterEach(() => {
  globalThis.fetch = originalFetch
  vi.restoreAllMocks()
})

describe('invoice ZIP requests', () => {
  it('creates or retrieves a ZIP request', async () => {
    const client = createClient()
    const data = {
      year: 2025,
      month: 3,
      issuer_type: IssuingType.ISSUING,
      invoice_types: [InvoiceType.INGRESO, InvoiceType.EGRESO],
    }

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe('https://api.test.local/v2/invoices/zip-requests')
      expect(options?.method).toBe('POST')
      expect(options?.body).toBe(JSON.stringify(data))
      return Response.json({
        id: 'zip_request_123',
        ...data,
        status: 'pending',
      })
    }) as typeof fetch

    const result = await client.invoices.createZipRequest(data)
    expect(result.id).toBe('zip_request_123')
  })

  it('lists ZIP requests with query parameters', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices/zip-requests?year=2025&month=3&status=finished&limit=20&page=1',
      )
      expect(options?.method).toBe('GET')
      return Response.json({
        page: 1,
        total_pages: 1,
        total_results: 0,
        data: [],
      })
    }) as typeof fetch

    const result = await client.invoices.listZipRequests({
      year: 2025,
      month: 3,
      status: 'finished',
      limit: 20,
      page: 1,
    })
    expect(result.data).toEqual([])
  })

  it('retrieves a ZIP request', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices/zip-requests/zip_request_123',
      )
      expect(options?.method).toBe('GET')
      return Response.json({ id: 'zip_request_123' })
    }) as typeof fetch

    const result = await client.invoices.retrieveZipRequest('zip_request_123')
    expect(result.id).toBe('zip_request_123')
  })

  it('downloads the generated ZIP', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices/zip-requests/zip_request_123/zip',
      )
      expect(options?.method).toBe('GET')
      return new Response(new Blob([Buffer.from('zip-binary-content')]), {
        headers: { 'content-type': 'application/zip' },
      })
    }) as typeof fetch

    const zip = await client.invoices.downloadZipRequest('zip_request_123')
    expect(zip instanceof Blob).toBe(false)
    expect(typeof (zip as { pipe?: unknown }).pipe).toBe('function')
  })

  it('requires an id to retrieve or download a ZIP request', async () => {
    const client = createClient()

    await expect(client.invoices.retrieveZipRequest('')).rejects.toThrow(
      'id is required',
    )
    await expect(client.invoices.downloadZipRequest('')).rejects.toThrow(
      'id is required',
    )
  })
})
