import { afterEach, describe, expect, it, vi } from 'vitest'

import Facturapi from '../../src'

const originalFetch = globalThis.fetch

const signedUrlResponse = (contentType: string, filename: string): Response =>
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
  it.each([
    [
      'PDF',
      'pdf',
      'application/pdf',
      (client: Facturapi) => client.invoices.downloadPdfUrl('inv_123'),
    ],
    [
      'XML',
      'xml',
      'application/xml',
      (client: Facturapi) => client.invoices.downloadXmlUrl('inv_123'),
    ],
    [
      'ZIP',
      'zip',
      'application/zip',
      (client: Facturapi) => client.invoices.downloadZipUrl('inv_123'),
    ],
  ])(
    'requests a signed URL for an invoice %s',
    async (_label, format, contentType, download) => {
      const client = new Facturapi('sk_test_123')
      client.BASE_URL = 'https://api.test.local/v2'
      globalThis.fetch = vi.fn(async (url, options) => {
        expect(url).toBe(
          `https://api.test.local/v2/invoices/inv_123/download-url/${format}`,
        )
        expect(options?.method).toBe('GET')
        return signedUrlResponse(contentType, `invoice.${format}`)
      }) as typeof fetch

      const result = await download(client)

      expect(result).toEqual(
        expect.objectContaining({
          content_type: contentType,
          filename: `invoice.${format}`,
          expires_at: '2030-01-01T00:00:00.000Z',
        }),
      )
    },
  )

  it.each([
    [
      'PDF',
      'pdf',
      'application/pdf',
      (client: Facturapi) =>
        client.invoices.downloadCancellationReceiptPdfUrl('inv_123'),
    ],
    [
      'XML',
      'xml',
      'application/xml',
      (client: Facturapi) =>
        client.invoices.downloadCancellationReceiptXmlUrl('inv_123'),
    ],
  ])(
    'requests a signed URL for a cancellation receipt %s',
    async (_label, format, contentType, download) => {
      const client = new Facturapi('sk_test_123')
      client.BASE_URL = 'https://api.test.local/v2'
      globalThis.fetch = vi.fn(async (url) => {
        expect(url).toBe(
          `https://api.test.local/v2/invoices/inv_123/cancellation_receipt/download-url/${format}`,
        )
        return signedUrlResponse(
          contentType,
          `cancellation_receipt_invoice.${format}`,
        )
      }) as typeof fetch

      const result = await download(client)

      expect(result.content_type).toBe(contentType)
    },
  )

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

  it.each([
    [
      'PDF',
      'pdf',
      'application/pdf',
      (client: Facturapi) => client.retentions.downloadPdfUrl('ret_123'),
    ],
    [
      'XML',
      'xml',
      'application/xml',
      (client: Facturapi) => client.retentions.downloadXmlUrl('ret_123'),
    ],
    [
      'ZIP',
      'zip',
      'application/zip',
      (client: Facturapi) => client.retentions.downloadZipUrl('ret_123'),
    ],
  ])(
    'requests a signed URL for a retention %s',
    async (_label, format, contentType, download) => {
      const client = new Facturapi('sk_test_123')
      client.BASE_URL = 'https://api.test.local/v2'
      globalThis.fetch = vi.fn(async (url) => {
        expect(url).toBe(
          `https://api.test.local/v2/retentions/ret_123/download-url/${format}`,
        )
        return signedUrlResponse(contentType, `retention.${format}`)
      }) as typeof fetch

      const result = await download(client)

      expect(result.content_type).toBe(contentType)
    },
  )

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
