import { AxiosInstance } from 'axios';

export default class Invoices {
  client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new valid invoice (CFDI).
   * @param {Object} data Invoice data
   * @returns {Promise} Invoice object
   */
  create(data: Record<string, any>, params?: Record<string, any> | null) {
    return this.client.post('/invoices', data, { params }).then((r) => r.data);
  }

  /**
   * Gets a paginated list of invoices created by your organization
   * @param {[Object]} params - Search parameters
   * @returns {Promise} Search results object. The object contains a `data` property with the list of invoices.
   */
  list(params?: Record<string, any> | null) {
    if (!params) params = {};
    return this.client.get('/invoices', { params }).then((r) => r.data);
  }

  /**
   * Gets a single invoice object
   * @param {string} id Invoice Id
   * @returns {Promise} Invoice object
   */
  retrieve(id: string) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/invoices/' + id).then((r) => r.data);
  }

  /**
   * Cancels an invoice. The invoice will not be valid anymore and will change its status to canceled.
   * @param {string} id
   * @param {any} params
   * @returns {Promise}
   */
  cancel(id: string, params: Record<string, any> | null) {
    return this.client
      .delete('/invoices/' + id, { params })
      .then((r) => r.data);
  }

  /**
   * Sends the invoice to the customer's email
   * @param {String} id Invoice Id
   * @param {any} data Additional arguments
   * @param {String} data.email Email address to send the invoice to
   * @returns {Promise}
   */
  sendByEmail(id: string, data: Record<string, any> | null) {
    return this.client
      .post('/invoices/' + id + '/email', data)
      .then((r) => r.data);
  }

  /**
   * Downloads the specified invoice in PDF format
   * @param {string} id Invoice Id
   * @returns {Promise<NodeJS.ReadableStream>} PDF file in a stream
   */
  downloadPdf(id: string): Promise<NodeJS.ReadableStream> {
    return this.client
      .get('/invoices/' + id + '/pdf', {
        responseType: 'stream',
      })
      .then((r) => r.data);
  }

  /**
   * Downloads the specified invoice in XML format
   * @param {string} id Invoice Id
   * @returns {Promise<NodeJS.ReadableStream>} XML file in a stream
   */
  downloadXml(id: string): Promise<NodeJS.ReadableStream> {
    return this.client
      .get('/invoices/' + id + '/xml', {
        responseType: 'stream',
      })
      .then((r) => r.data);
  }

  /**
   * Downloads the specified invoice in a ZIP package containing both PDF and XML files
   * @param {string} id Invoice Id
   * @returns {Promise<NodeJS.ReadableStream>} ZIP file in a stream
   */
  downloadZip(id: string): Promise<NodeJS.ReadableStream> {
    return this.client
      .get('/invoices/' + id + '/zip', {
        responseType: 'stream',
      })
      .then((r) => r.data);
  }

  /**
   * Downloads the cancellation receipt of a canceled invoice in XML format
   * @param {string} id Invoice Id
   * @returns {Promise<NodeJS.ReadableStream>} XML file in a stream
   */
  downloadCancellationReceiptXml(id: string): Promise<NodeJS.ReadableStream> {
    return this.client
      .get('/invoices/' + id + '/cancellation_receipt/xml', {
        responseType: 'stream',
      })
      .then((r) => r.data);
  }

  /**
   * Downloads the cancellation receipt of a canceled invoice in PDF format
   * @param {string} id Invoice Id
   * @returns {Promise<NodeJS.ReadableStream>} PDF file in a stream
   */
  downloadCancellationReceiptPdf(id: string): Promise<NodeJS.ReadableStream> {
    return this.client
      .get('/invoices/' + id + '/cancellation_receipt/pdf', {
        responseType: 'stream',
      })
      .then((r) => r.data);
  }

  /**
   * Edits an invoice with "draft" status.
   * @param {string} id Invoice Id
   * @param {Object} data Invoice data to edit
   * @returns {Promise} Edited invoice
   */
  updateDraft(id: string, data: Record<string, any>) {
    return this.client.put('/invoices/' + id, data).then((r) => r.data);
  }

  /**
   * Stamps an invoice with "draft" status.
   * @param {string} id Invoice Id
   * @param {Object} options Query options
   * @returns {Promise} Stamped invoice
   */
  stampDraft(id: string, params?: Record<string, any> | null) {
    return this.client
      .post('/invoices/' + id + '/stamp', { params })
      .then((r) => r.data);
  }

  /**
   * Updates the latest status of the invoice from the SAT
   * @param {string} id Invoice Id
   * @returns {Promise} Updated invoice
   */
  updateStatus(id: string) {
    return this.client.put('/invoices/' + id + '/status').then((r) => r.data);
  }

  /**
   * Creates a draft invoice from any other invoice
   * @param {string} id Invoice Id
   * @returns {Promise} Draft invoice
   */
  copyToDraft(id: string) {
    return this.client.post('/invoices/' + id + '/copy').then((r) => r.data);
  }
}
