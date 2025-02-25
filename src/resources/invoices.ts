import {
  CancelInvoiceOptions,
  GenericResponse,
  Invoice,
  SearchResult,
  SendEmailBody,
} from '../types';
import { WrapperClient } from '../wrapper';

export default class Invoices {
  client: WrapperClient;

  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Creates a new valid invoice (CFDI).
   * @param body Invoice data
   * @param params Query params
   * @returns Invoice object
   */
  create(
    body: Record<string, any>,
    params?: Record<string, any> | null,
  ): Promise<Invoice> {
    return this.client.post('/invoices', { body, params });
  }

  /**
   * Gets a paginated list of invoices created by your organization
   * @param params - Search parameters
   * @returns Search results object. The object contains a `data` property with the list of invoices.
   */
  list(params?: Record<string, any> | null): Promise<SearchResult<Invoice>> {
    if (!params) params = {};
    return this.client.get('/invoices', { params });
  }

  /**
   * Gets a single invoice object
   * @param id Invoice Id
   * @returns Invoice object
   */
  retrieve(id: string): Promise<Invoice> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/invoices/' + id);
  }

  /**
   * Cancels an invoice. The invoice will not be valid anymore and will change its status to canceled.
   * @param id Invoice Id
   * @param params Cancel options
   * @returns Canceled invoice
   */
  cancel(id: string, params: CancelInvoiceOptions): Promise<Invoice> {
    return this.client.delete('/invoices/' + id, { params });
  }

  /**
   * Sends the invoice to the customer's email
   * @param id Invoice Id
   * @param options Additional arguments
   * @param options.email Email address to send the invoice to
   * @returns Object with 'ok' property set to true if the email was sent successfully
   */
  sendByEmail(id: string, options?: SendEmailBody): Promise<GenericResponse> {
    return this.client.post('/invoices/' + id + '/email', { body: options });
  }

  /**
   * Downloads the specified invoice in PDF format
   * @param id Invoice Id
   * @returns PDF file in a stream (Node.js) or Blob (browser)
   */
  async downloadPdf(id: string): Promise<NodeJS.ReadableStream | Blob> {
    return this.client.get('/invoices/' + id + '/pdf');
  }

  /**
   * Downloads the specified invoice in XML format
   * @param id Invoice Id
   * @returns XML file in a stream (Node.js) or Blob (browser)
   */
  async downloadXml(id: string): Promise<NodeJS.ReadableStream | Blob> {
    return this.client.get('/invoices/' + id + '/xml');
  }

  /**
   * Downloads the specified invoice in a ZIP package containing both PDF and XML files
   * @param id Invoice Id
   * @returns ZIP file in a stream (Node.js) or Blob (browser)
   */
  downloadZip(id: string): Promise<NodeJS.ReadableStream | Blob> {
    return this.client.get('/invoices/' + id + '/zip');
  }

  /**
   * Downloads the cancellation receipt of a canceled invoice in XML format
   * @param id Invoice Id
   * @returns XML file in a stream (Node.js) or Blob (browser)
   */
  downloadCancellationReceiptXml(
    id: string,
  ): Promise<NodeJS.ReadableStream | Blob> {
    return this.client.get('/invoices/' + id + '/cancellation_receipt/xml');
  }

  /**
   * Downloads the cancellation receipt of a canceled invoice in PDF format
   * @param id Invoice Id
   * @returns PDF file in a stream (Node.js) or Blob (browser)
   */
  downloadCancellationReceiptPdf(
    id: string,
  ): Promise<NodeJS.ReadableStream | Blob> {
    return this.client.get('/invoices/' + id + '/cancellation_receipt/pdf');
  }

  /**
   * Edits an invoice with "draft" status.
   * @param id Invoice Id
   * @param data Invoice data to edit
   * @returns Edited invoice
   */
  updateDraft(id: string, data: Record<string, any>): Promise<Invoice> {
    return this.client.put('/invoices/' + id, { body: data });
  }

  /**
   * Stamps an invoice with "draft" status.
   * @param id Invoice Id
   * @param params Query params
   * @returns Stamped invoice
   */
  stampDraft(
    id: string,
    params?: Record<string, any> | null,
  ): Promise<Invoice> {
    return this.client.post('/invoices/' + id + '/stamp', { params });
  }

  /**
   * Updates the latest status of the invoice from the SAT
   * @param id Invoice Id
   * @returns Updated invoice
   */
  updateStatus(id: string): Promise<Invoice> {
    return this.client.put('/invoices/' + id + '/status');
  }

  /**
   * Creates a draft invoice from any other invoice
   * @param id Invoice Id
   * @returns Draft invoice
   */
  copyToDraft(id: string): Promise<Invoice> {
    return this.client.post('/invoices/' + id + '/copy');
  }
}
