import { expectAssignable, expectType, expectError } from 'tsd'
import Facturapi, {
  BinaryDownload,
  CursorSearchParams,
  PageSearchParams,
  FacturapiError,
  Invoice,
  InvoiceItem,
  InvoiceType,
  IssuingType,
  NodeLikeReadableStream,
  SearchResult,
  SignedDownloadUrl,
  TaxFactor,
  ZipRequest,
} from '../dist'

const client = new Facturapi('sk_test_123')

const zipPromise = client.invoices.downloadZip('inv_123')
expectType<Promise<BinaryDownload>>(zipPromise)

expectType<Promise<ZipRequest>>(
  client.invoices.createZipRequest({
    year: 2025,
    month: 3,
    issuer_type: IssuingType.ISSUING,
    invoice_types: [InvoiceType.INGRESO, InvoiceType.EGRESO],
  }),
)
expectType<Promise<SearchResult<ZipRequest>>>(
  client.invoices.listZipRequests({
    year: 2025,
    month: 3,
    status: 'finished',
    limit: 20,
    page: 1,
  }),
)
expectType<Promise<ZipRequest>>(
  client.invoices.retrieveZipRequest('zip_request_123'),
)
expectType<Promise<BinaryDownload>>(
  client.invoices.downloadZipRequest('zip_request_123'),
)

declare const signedDownloadUrl: SignedDownloadUrl
expectType<string>(signedDownloadUrl.url)
expectType<string>(signedDownloadUrl.expires_at)
expectType<string>(signedDownloadUrl.content_type)
expectType<string>(signedDownloadUrl.filename)
expectType<Promise<SignedDownloadUrl>>(
  client.invoices.downloadPdfUrl('inv_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.invoices.downloadXmlUrl('inv_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.invoices.downloadZipUrl('inv_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.invoices.downloadCancellationReceiptPdfUrl('inv_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.invoices.downloadCancellationReceiptXmlUrl('inv_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.invoices.downloadZipRequestUrl('zip_request_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.invoices.previewPdfUrl({ customer: 'cus_123', items: [] }),
)
expectType<Promise<SignedDownloadUrl>>(
  client.receipts.downloadPdfUrl('rec_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.receipts.previewToInvoicePdfUrl({ keys: ['receipt-key'] }),
)
expectType<Promise<SignedDownloadUrl>>(
  client.retentions.downloadPdfUrl('ret_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.retentions.downloadXmlUrl('ret_123'),
)
expectType<Promise<SignedDownloadUrl>>(
  client.retentions.downloadZipUrl('ret_123'),
)

declare const nodeLike: NodeLikeReadableStream
nodeLike.on('data', (chunk) => {
  expectType<unknown>(chunk)
})

if (nodeLike.pipe) {
  const destination = { write: (_chunk: unknown) => undefined }
  expectType<typeof destination>(nodeLike.pipe(destination))
}

declare const binary: BinaryDownload
expectError(binary.pipe({}))

if ('pipe' in binary && typeof binary.pipe === 'function') {
  const destination = { write: (_chunk: unknown) => undefined }
  expectType<typeof destination>(binary.pipe(destination))
}

expectAssignable<TaxFactor>(TaxFactor.EXENTO)

declare const invoiceItem: InvoiceItem
expectType<string[]>(invoiceItem.property_tax_account)

declare const invoice: Invoice
expectType<Date>(invoice.created_at)
expectType<Date>(invoice.date)
expectType<Date | undefined>(invoice.cancellation?.requested_at)
expectType<string | undefined>(invoice.stamp?.date)

declare const apiError: FacturapiError
expectType<number>(apiError.status)
expectType<string | undefined>(apiError.code)
expectType<string | undefined>(apiError.path)
expectType<string | undefined>(apiError.location)
expectType<string | undefined>(apiError.logId)
expectType<Record<string, string>>(apiError.headers)

// Pagination params document the two modes; both return the same envelope.
expectAssignable<PageSearchParams>({ page: 2 })
expectAssignable<CursorSearchParams>({ pagination: 'cursor', limit: 50 })
expectType<Promise<SearchResult<Invoice>>>(
  client.invoices.list({ page: 2, limit: 50 }),
)
expectType<Promise<SearchResult<Invoice>>>(
  client.invoices.list({ pagination: 'cursor', limit: 50 }),
)
expectType<Promise<SearchResult<Invoice>>>(
  client.invoices.list({ after: 'cursor-token' }),
)
const looseParams: Record<string, any> = { page: 2 }
expectType<Promise<SearchResult<Invoice>>>(client.invoices.list(looseParams))
expectType<Promise<SearchResult<Invoice>>>(client.invoices.list())
// Totals and cursors are optional because cursor pages omit them.
expectType<Promise<number | undefined>>(
  client.invoices.list({ page: 1 }).then((result) => result.total_results),
)
expectType<Promise<string | null | undefined>>(
  client.invoices.list({ after: 'token' }).then((result) => result.next_cursor),
)
