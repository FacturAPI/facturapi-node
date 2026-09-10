import {
  BinaryDownload,
  GenericResponse,
  Invoice,
  ReceiptsToInvoiceInput,
  Receipt,
  SearchResult,
  SendEmailBody,
  PreviewReceiptsToInvoicePdfInput,
} from '../types'
import { WrapperClient } from '../wrapper'

export default class Receipts {
  client: WrapperClient
  constructor(client: WrapperClient) {
    this.client = client
  }

  /**
   * Creates a new receipt
   * @param data Receipt data
   * @returns Receipt object
   */
  create(data: Record<string, any>): Promise<Receipt> {
    return this.client.post('/receipts', { body: data })
  }

  /**
   * Gets a paginated list of receipts that belong to your organization
   * @param params Search parameters
   * @returns Search results object. The object contains a `data` property with the list of receipts.
   */
  list(params?: Record<string, any> | null): Promise<SearchResult<Receipt>> {
    if (!params) params = {}
    return this.client.get('/receipts', { params })
  }

  /**
   * Gets a single receipt object
   * @param id Receipt Id
   * @returns Receipt object
   */
  retrieve(id: string): Promise<Receipt> {
    if (!id) return Promise.reject(new Error('id is required'))
    return this.client.get('/receipts/' + id)
  }

  /**
   * Creates an invoice for this receipt
   * @param id Receipt Id
   * @param data Invoice data
   * @returns Invoice object
   */
  invoice(id: string, data: Record<string, any>): Promise<Invoice> {
    return this.client.post('/receipts/' + id + '/invoice', { body: data })
  }

  /**
   * Creates a global invoice for open receipts
   * @param data
   * @returns
   */
  createGlobalInvoice(data: Record<string, any>): Promise<Invoice> {
    return this.client.post('/receipts/global-invoice', { body: data })
  }

  /**
   * Creates an invoice from multiple receipts by key.
   * Supports dry-run summaries when `dry_run` is true.
   * @param data Receipts to-invoice request data
   * @returns Invoice object or dry-run summary
   */
  toInvoice(data: ReceiptsToInvoiceInput): Promise<Invoice> {
    return this.client.post('/receipts/to-invoice', { body: data })
  }

  /**
   * Generates a PDF preview for a receipts-to-invoice request before stamping.
   * @param data Receipts-to-invoice preview data
   * @returns PDF file in a stream (Node.js) or Blob (browser)
   */
  previewToInvoicePdf(
    data: PreviewReceiptsToInvoicePdfInput,
  ): Promise<BinaryDownload> {
    return this.client.post('/receipts/to-invoice/preview/pdf', {
      body: data,
    })
  }

  /**
   * Marks a receipt as canceled. The receipt won't be available for invoicing anymore.
   * @param id
   * @returns
   */
  cancel(id: string): Promise<Receipt> {
    return this.client.delete('/receipts/' + id)
  }

  /**
   * Sends the receipt to the customer's email
   * @param id Receipt Id
   * @param data Additional arguments
   * @param data.email Email address to send the receipt to
   * @returns Email sent confirmation
   */
  sendByEmail(id: string, data?: SendEmailBody): Promise<GenericResponse> {
    return this.client.post('/receipts/' + id + '/email', { body: data })
  }

  /**
   * Downloads the specified receipt in PDF format
   * @param id Receipt Id
   * @returns PDF file in a stream (Node.js) or Blob (browser)
   */
  downloadPdf(id: string): Promise<BinaryDownload> {
    return this.client.get('/receipts/' + id + '/pdf')
  }
}
