import { afterEach, describe, expect, it, vi } from 'vitest'

import Facturapi from '../../src'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
  vi.restoreAllMocks()
})

describe('invoice signed download URLs', () => {
  it('requests a signed URL for an invoice file', async () => {
    const client = new Facturapi('sk_test_123')
    client.BASE_URL = 'https://api.test.local/v2'
    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices/inv_123/download-url/zip',
      )
      expect(options?.method).toBe('GET')
      return new Response(
        JSON.stringify({
          url: 'https://storage.googleapis.com/signed-download',
          expires_at: '2030-01-01T00:00:00.000Z',
          content_type: 'application/zip',
          filename: 'invoice.zip',
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      )
    }) as typeof fetch

    const result = await client.invoices.getDownloadUrl('inv_123', 'zip')

    expect(result.filename).toBe('invoice.zip')
  })

  it('requests a signed URL for a cancellation receipt', async () => {
    const client = new Facturapi('sk_test_123')
    client.BASE_URL = 'https://api.test.local/v2'
    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices/inv_123/cancellation_receipt/download-url/pdf',
      )
      return new Response(
        JSON.stringify({
          url: 'https://storage.googleapis.com/signed-download',
          expires_at: '2030-01-01T00:00:00.000Z',
          content_type: 'application/pdf',
          filename: 'cancellation_receipt_invoice.pdf',
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      )
    }) as typeof fetch

    const result = await client.invoices.getCancellationReceiptDownloadUrl(
      'inv_123',
      'pdf',
    )

    expect(result.content_type).toBe('application/pdf')
  })

  it('rejects missing invoice ids before making a request', async () => {
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock
    const client = new Facturapi('sk_test_123')

    await expect(client.invoices.getDownloadUrl('', 'pdf')).rejects.toThrow(
      'id is required',
    )
    await expect(
      client.invoices.getCancellationReceiptDownloadUrl('', 'xml'),
    ).rejects.toThrow('id is required')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
