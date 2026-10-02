import {
  expectAssignable,
  expectNotAssignable,
  expectType,
  expectError,
} from 'tsd'
import Facturapi, {
  BinaryDownload,
  ApiKeys,
  ApiEvent,
  CursorSearchParams,
  Customer,
  PageSearchParams,
  FacturapiError,
  Invoice,
  InvoiceDraft,
  CustomerInfo,
  CancelInvoiceOptions,
  CustomerNationalCreateInput,
  CustomerForeignCreateInput,
  CustomerGenericCreateInput,
  InvoiceCreateInput,
  InvoiceNominaEditInput,
  NominaPercepcionInput,
  NominaEntidadSncfInput,
  NominaEmisorInput,
  NominaHorasExtraInput,
  BaseTax,
  TaxType,
  IepsMode,
  CartaPorteAutotransporte,
  InvoiceItem,
  InvoiceType,
  IssuingType,
  NodeLikeReadableStream,
  Organization,
  OrganizationInvite,
  OrganizationTeamRole,
  OrganizationUserAccess,
  PagoComplementData,
  Product,
  Receipt,
  Retention,
  SearchResult,
  SignedDownloadUrl,
  TaxFactor,
  ToInvoiceSummary,
  Webhook,
  ZipRequest,
} from '../dist'

const client = new Facturapi('sk_test_123')

declare const createdInvoice: Awaited<ReturnType<typeof client.invoices.create>>
expectAssignable<Invoice | InvoiceDraft>(createdInvoice)
expectAssignable<Date | null | undefined>(createdInvoice.date)
expectAssignable<Invoice['stamp'] | undefined>(createdInvoice.stamp)

expectAssignable<InvoiceNominaEditInput>({ type: 'N' })
expectError<InvoiceNominaEditInput>({ type: 'P' })
expectAssignable<InvoiceCreateInput>({
  status: 'draft',
  complements: [
    {
      type: 'leyendas_fiscales',
      data: { leyendas: [{ texto_leyenda: 'Ejemplo' }] },
    },
  ],
})
expectAssignable<NominaPercepcionInput>({
  tipo_percepcion: '001',
  clave: 'ABC',
  importe_gravado: 1,
  importe_exento: 0,
})
expectError<NominaPercepcionInput>({
  tipo_percepcion: '019',
  clave: 'ABC',
  importe_gravado: 1,
  importe_exento: 0,
})
expectError<NominaPercepcionInput>({ tipo_percepcion: '001', clave: 'ABC' })
expectAssignable<NominaPercepcionInput>({
  tipo_percepcion: '019',
  clave: 'ABC',
  importe_gravado: 1,
  importe_exento: 0,
  horas_extra: [
    { dias: 1, tipo_horas: '01', horas_extra: 1, importe_pagado: 1 },
  ],
})
expectError<NominaHorasExtraInput>({
  dias: 1,
  tipo_horas: '01',
  horas_extra: 1,
})
expectAssignable<NominaEntidadSncfInput>({
  origen_recurso: 'IM',
  monto_recurso_propio: 1,
})
expectAssignable<NominaEntidadSncfInput>({ origen_recurso: 'IF' })
expectError<NominaEntidadSncfInput>({ origen_recurso: 'IM' })
expectError<NominaEmisorInput>({ entidad_sncf: { origen_recurso: 'IM' } })
expectError(
  client.invoices.create({
    type: 'P',
    customer: 'cus',
    complements: [{ type: 'pago', data: { tipo_nomina: 'O' } }],
  }),
)
expectError<InvoiceCreateInput>({
  type: 'P',
  customer: 'cus',
  payment_method: 'PPD',
  complements: [],
})
client.invoices.updateDraft('draft', { type: 'N' })
expectAssignable<BaseTax>({
  type: TaxType.IEPS,
  rate: 0.08,
  ieps_mode: IepsMode.UNIT,
})
expectError<CartaPorteAutotransporte>({
  PermSCT: 'TPAF01',
  NumPermisoSCT: 'Example',
})

expectAssignable<InvoiceCreateInput>({ status: 'draft', date: new Date() })
expectAssignable<InvoiceCreateInput>({ type: 'E', status: 'draft' })
expectAssignable<InvoiceCreateInput>({ type: 'P', status: 'draft' })
expectAssignable<InvoiceCreateInput>({ type: 'N', status: 'draft' })
expectAssignable<InvoiceCreateInput>({ type: 'T', status: 'draft' })
expectError<InvoiceCreateInput>({ type: 'I', status: 'pending' })
expectError<InvoiceCreateInput>({ type: 'E', status: 'pending' })
expectError<InvoiceCreateInput>({ type: 'P', status: 'pending' })
expectError<InvoiceCreateInput>({ type: 'N', status: 'pending' })
expectError<InvoiceCreateInput>({ type: 'T', status: 'pending' })
expectError<InvoiceCreateInput>({})
declare const invoiceInput: InvoiceCreateInput
if (invoiceInput.status !== 'draft') {
  expectNotAssignable<undefined>(invoiceInput.customer)
  if (invoiceInput.type === 'P') {
    expectNotAssignable<undefined>(invoiceInput.complements)
  }
}
expectAssignable<InvoiceCreateInput>({
  status: 'draft',
  date: '2026-09-30T12:00:00Z',
})
expectAssignable<InvoiceCreateInput>({
  customer: 'cus',
  payment_form: '28',
  items: [
    {
      quantity: 1,
      product: { description: 'Ejemplo', product_key: '60131324', price: 1 },
    },
  ],
})
expectAssignable<InvoiceCreateInput>({
  status: 'draft',
  customer: null,
  payment_form: null,
  use: null,
})
client.invoices.updateDraft('draft', { type: 'E', customer: null })
expectError<InvoiceNominaEditInput>({ type: 'N', customer: null })
client.invoices.create({
  type: 'P',
  customer: 'cus',
  complements: [
    {
      type: 'pago',
      data: {
        payment_form: '28',
        related_documents: [
          {
            uuid: '39c85a3f-275b-4341-b259-e8971d9f8a94',
            amount: 1,
            installment: 1,
            last_balance: 1,
            taxes: [],
          },
        ],
      },
    },
  ],
})
expectError(
  client.webhooks.create({
    url: 'https://example.com/webhook',
    enabled_events: ['*'],
    secret: 'caller-secret',
  }),
)
expectType<Promise<Invoice>>(
  client.receipts.toInvoice({ keys: ['receipt-key'] }),
)
expectType<Promise<ToInvoiceSummary>>(
  client.receipts.toInvoice({ keys: ['receipt-key'], dry_run: true }),
)
declare const dryRun: boolean
expectType<Promise<Invoice | ToInvoiceSummary>>(
  client.receipts.toInvoice({ keys: ['receipt-key'], dry_run: dryRun }),
)

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
expectType<Date>(signedDownloadUrl.expires_at)
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
expectType<string[] | undefined>(invoiceItem.property_tax_account)

declare const invoice: Invoice
expectType<Date>(invoice.created_at)
expectType<Date | null>(invoice.date)
expectType<Date | null | undefined>(invoice.canceled_at)
expectError(invoice.cancellation)
expectType<string | undefined>(invoice.stamp?.date)

declare const receipt: Receipt
expectType<Date>(receipt.created_at)
expectType<Date>(receipt.date)
expectType<Date>(receipt.expires_at)

declare const customer: Customer
expectType<Date>(customer.created_at)
expectType<Date | null | undefined>(customer.sat_validated_at)
expectType<Date | null | undefined>(customer.edit_link_expires_at)
declare const product: Product
expectType<Date>(product.created_at)
declare const organization: Organization
expectType<Date>(organization.created_at)
expectType<Date | undefined>(organization.certificate.expires_at)
expectType<Date | undefined>(organization.pending_add_ons_update?.scheduled_for)
declare const draftResponse: InvoiceDraft
expectAssignable<InvoiceDraft['customer']>(null)
expectType<CustomerInfo | null | undefined>(draftResponse.customer)
expectError(
  client.webhooks.create({
    url: 'https://example.com/hooks',
    enabled_events: ['*'],
  }),
)
expectError(
  client.webhooks.update('hook_example', {
    status: 'enabled',
    enabled_events: ['*'],
  }),
)
declare const webhook: Webhook
expectAssignable<NonNullable<Webhook['enabled_events']>[number]>('*')
expectType<Date>(webhook.created_at)
declare const event: ApiEvent
expectType<Date>(event.created_at)
declare const payment: PagoComplementData
expectType<Date>(payment.date)
expectType<'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | undefined>(
  payment.related_documents[0].taxability,
)
declare const zipRequest: ZipRequest
expectType<Date>(zipRequest.created_at)
expectType<Date | undefined>(zipRequest.scheduled_at)
expectError(zipRequest.updated_at)

declare const retention: Retention
expectType<Date | null>(retention.fecha_exp)
expectType<string | undefined>(retention.stamp?.date)

declare const apiKey: ApiKeys
expectType<Date>(apiKey.created_at)
declare const access: OrganizationUserAccess
expectType<Date>(access.created_at)
expectType<Date>(access.updated_at)
declare const invite: OrganizationInvite
expectType<Date>(invite.created_at)
expectType<Date | null>(invite.expires_at)
declare const role: OrganizationTeamRole
expectType<Date | null>(role.created_at)
expectType<Date | null>(role.updated_at)

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

declare const paymentSummary: Awaited<
  ReturnType<typeof client.invoices.paymentSummary>
>
expectAssignable<PagoComplementData['related_documents'][number]>(
  paymentSummary,
)
expectNotAssignable<
  PagoComplementData['related_documents'][number]['taxability']
>(1)

// Incomplete customer information is accepted only when an edit link is requested.
client.customers.create({}, { createEditLink: true })
client.customers.create(
  { email: 'cliente@example.com' },
  { createEditLink: true },
)
client.customers.create(
  { address: { city: 'Hermosillo' } },
  { createEditLink: true },
)
expectError(client.customers.create({}))
expectError(client.customers.create({}, { createEditLink: false }))
expectError(
  client.customers.create({}, { createEditLink: Math.random() > 0.5 }),
)
expectError(client.customers.create({ address: { zip: '83200' } }))
expectError(client.customers.create({ email: 123 }, { createEditLink: true }))

// Country and RFC variants preserve the requirements of customer creation.
client.customers.create({
  legal_name: 'Cliente nacional',
  tax_id: 'ABC101010111',
  tax_system: '601',
  address: { zip: '83200' },
})
client.customers.create({
  legal_name: 'Foreign customer',
  address: { country: 'USA' },
})
client.customers.create({
  legal_name: 'Foreign customer',
  tax_id: null,
  tax_system: null,
  address: { country: 'USA' },
})
client.customers.create({
  legal_name: 'PUBLICO EN GENERAL',
  tax_id: 'XAXX010101000',
})
expectNotAssignable<CustomerNationalCreateInput>({
  legal_name: 'Cliente',
  tax_system: '601',
  address: { zip: '83200' },
})
expectNotAssignable<CustomerNationalCreateInput>({
  legal_name: 'Cliente',
  tax_id: 'ABC101010111',
  address: { zip: '83200' },
})
expectNotAssignable<CustomerNationalCreateInput>({
  legal_name: 'Cliente',
  tax_id: 'ABC101010111',
  tax_system: '601',
  address: {},
})
expectNotAssignable<CustomerForeignCreateInput>({
  legal_name: 'Foreign',
  tax_system: '601',
  address: { country: 'USA' },
})
expectNotAssignable<CustomerGenericCreateInput>({
  legal_name: 'Publico',
  tax_id: 'XAXX010101000',
  tax_system: '601',
})
expectError(client.customers.create({ legal_name: 'Foreign', address: {} }))

// A default period needs no fields; explicit receipt selection needs both dates.
client.receipts.createGlobalInvoice({})
client.receipts.createGlobalInvoice({
  receipts: ['rec_ejemplo'],
  from: '2026-01-01',
  to: new Date(),
})
expectError(client.receipts.createGlobalInvoice({ receipts: ['rec_ejemplo'] }))
expectError(
  client.receipts.createGlobalInvoice({
    receipts: ['rec_ejemplo'],
    from: new Date(),
  }),
)

// Draft deletion needs no query; replacement motives need a substitution.
client.invoices.cancel('inv_ejemplo')
client.retentions.cancel('ret_ejemplo')
client.invoices.cancel('inv_ejemplo', { motive: '02' })
client.retentions.cancel('ret_ejemplo', { motive: '03' })
client.invoices.cancel('inv_ejemplo', {
  motive: '01',
  substitution: 'inv_sustituto',
})
client.retentions.cancel('ret_ejemplo', {
  motive: '04',
  substitution: 'ret_sustituto',
})
expectError(client.invoices.cancel('inv_ejemplo', { motive: '01' }))
expectError(client.invoices.cancel('inv_ejemplo', { motive: '04' }))
expectError(client.retentions.cancel('ret_ejemplo', { motive: '01' }))
expectError(client.retentions.cancel('ret_ejemplo', { motive: '04' }))
expectError(
  client.invoices.cancel('inv_ejemplo', { substitution: 'inv_sustituto' }),
)
expectError(
  client.customers.create({
    legal_name: undefined,
    address: { country: 'USA' },
  }),
)
expectNotAssignable<CustomerNationalCreateInput>({
  legal_name: 'Cliente',
  tax_id: 'ABC101010111',
  tax_system: undefined,
  address: { zip: '83200' },
})
expectNotAssignable<CustomerNationalCreateInput>({
  legal_name: 'Cliente',
  tax_id: 'ABC101010111',
  tax_system: '601',
  address: { zip: undefined },
})
expectError(
  client.receipts.createGlobalInvoice({
    receipts: ['rec_ejemplo'],
    from: undefined,
    to: undefined,
  }),
)

// Existing public aliases use the same conditional contract as the method.
expectNotAssignable<CancelInvoiceOptions>({ motive: '01' })
expectAssignable<CancelInvoiceOptions>({
  motive: '04',
  substitution: 'inv_sustituto',
})
declare const customerWithIncompleteFiscalInfo: Customer
expectType<string | null | undefined>(customerWithIncompleteFiscalInfo.tax_id)
expectType<string | null | undefined>(
  customerWithIncompleteFiscalInfo.tax_system,
)
expectType<string | null | undefined>(customerWithIncompleteFiscalInfo.phone)
expectType<Date | null | undefined>(
  customerWithIncompleteFiscalInfo.edit_link_expires_at,
)
client.customers.create({ tax_id: null }, { createEditLink: true })
client.customers.update('cus_ejemplo', { phone: null })
expectError(
  client.customers.create({ tax_system: null }, { createEditLink: true }),
)

// Explicit creation methods select their own contract without narrowing a free country string.
client.customers.createNational({
  legal_name: 'Cliente',
  tax_id: 'ABC101010111',
  tax_system: '601',
  address: { zip: '83200' },
})
client.customers.createForeign({
  legal_name: 'Foreign',
  address: { country: 'USA' },
})
client.customers.createForeign({
  legal_name: 'Foreign',
  address: { country: 'MEX' },
})
client.customers.createGeneric({
  legal_name: 'Publico',
  tax_id: 'XAXX010101000',
})
client.customers.createGeneric({
  legal_name: 'Generic foreign',
  tax_id: 'XEXX010101000',
})
expectError(
  client.customers.createNational({
    legal_name: 'Cliente',
    tax_system: '601',
    address: { country: 'MEX', zip: '83200' },
  }),
)
expectError(
  client.customers.createNational({
    legal_name: 'Cliente',
    tax_id: 'ABC101010111',
    address: { zip: '83200' },
  }),
)
expectError(
  client.customers.createNational({
    legal_name: 'Cliente',
    tax_id: 'ABC101010111',
    tax_system: '601',
    address: {},
  }),
)
expectError(
  client.customers.createForeign({ legal_name: 'Foreign', address: {} }),
)
expectError(
  client.customers.createGeneric({
    legal_name: 'Cliente',
    tax_id: 'ABC101010111',
  }),
)
expectError(
  client.customers.createGeneric({
    legal_name: 'Publico',
    tax_id: 'XAXX010101000',
    tax_system: '601',
  }),
)
// Incomplete creation remains an explicit option of the general method.
expectError(client.customers.createNational({}, { createEditLink: true }))
client.customers.create({}, { createEditLink: true })

// Updating a product does not require resending its creation fields.
client.products.update('prod_ejemplo', { price: 456.7 })
client.products.update('prod_ejemplo', { description: 'Actualizado' })
expectError(
  client.products.update('prod_ejemplo', { email: 'jdoe@example.com' }),
)
expectError(client.products.create({ price: 456.7 }))

// Native Node streams are valid upload inputs without casts.
import type { ReadStream } from 'node:fs'
declare const nativeReadStream: ReadStream
client.organizations.uploadLogo('org_ejemplo', nativeReadStream)
client.organizations.uploadCertificate(
  'org_ejemplo',
  nativeReadStream,
  nativeReadStream,
  'example-password',
)
