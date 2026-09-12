import { afterEach, describe, expect, it, vi } from 'vitest'

import Facturapi from '../../src'

const originalFetch = globalThis.fetch

const signedUrlResponse = (
  contentType: string,
  filename: string,
): Response =>
  new Response(
    JSON.stringify({
      url: 'https://storage.googleapis.com/signed-download',
      expires_at: '2030-01-01T00:00:00.000Z',
      content_type: contentType,
      filename,
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )

afterEach(() => {
  globalThis.fetch = originalFetch
  vi.restoreAllMocks()
})

describe('signed download URLs', () => {
  it('requests a signed URL for an invoice file', async () => {
    const client = new Facturapi('sk_test_123')
    client.BASE_URL = 'https://api.test.local/v2'
    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices/inv_123/download-url/zip',
      )
      expect(options?.method).toBe('GET')
      return signedUrlResponse('application/zip', 'invoice.zip')
    }) as typeof fetch

    const result = await client.invoices.downloadZipUrl('inv_123')

    expect(result.filename).toBe('invoice.zip')
  })

  it('requests a signed URL for a cancellation receipt', async () => {
    const client = new Facturapi('sk_test_123')
    client.BASE_URL = 'https://api.test.local/v2'
    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices/inv_123/cancellation_receipt/download-url/pdf',
      )
      return signedUrlResponse(
        'application/pdf',
        'cancellation_receipt_invoice.pdf',
      )
    }) as typeof fetch

    const result = await client.invoices.downloadCancellationReceiptPdfUrl(
      'inv_123',
    )

    expect(result.content_type).toBe('application/pdf')
  })

  it('requests a signed URL for the receipt PDF', async () => {
    const client = new Facturapi('sk_test_123')
    client.BASE_URL = 'https://api.test.local/v2'
    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/receipts/rec_123/download-url/pdf',
      )
      return signedUrlResponse('application/pdf', 'receipt.pdf')
    }) as typeof fetch

    const result = await client.receipts.downloadPdfUrl('rec_123')

    expect(result.filename).toBe('receipt.pdf')
  })

  it('requests a signed URL for a retention', async () => {
    const client = new Facturapi('sk_test_123')
    client.BASE_URL = 'https://api.test.local/v2'
    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/retentions/ret_123/download-url/xml',
      )
      return signedUrlResponse('application/xml', 'retention.xml')
    }) as typeof fetch

    const result = await client.retentions.downloadXmlUrl('ret_123')

    expect(result.content_type).toBe('application/xml')
  })

  it('requests signed URLs for PDF previews', async () => {
    const client = new Facturapi('sk_test_123')
    client.BASE_URL = 'https://api.test.local/v2'
    const requests: string[] = []
    globalThis.fetch = vi.fn(async (url, options) => {
      requests.push(String(url))
      expect(options?.method).toBe('POST')
      return signedUrlResponse('application/pdf', 'invoice-preview.pdf')
    }) as typeof fetch

    await client.invoices.previewPdfUrl({ customer: 'cus_123', items: [] })
    await client.receipts.previewToInvoicePdfUrl({ keys: ['receipt-key'] })

    expect(requests).toEqual([
      'https://api.test.local/v2/invoices/preview/pdf/download-url',
      'https://api.test.local/v2/receipts/to-invoice/preview/download-url',
    ])
  })

  it('rejects missing ids before making a request', async () => {
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock
    const client = new Facturapi('sk_test_123')

    await expect(client.invoices.downloadPdfUrl('')).rejects.toThrow(
      'id is required',
    )
    await expect(
      client.invoices.downloadCancellationReceiptXmlUrl(''),
    ).rejects.toThrow('id is required')
    await expect(client.receipts.downloadPdfUrl('')).rejects.toThrow(
      'id is required',
    )
    await expect(client.retentions.downloadZipUrl('')).rejects.toThrow(
      'id is required',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
