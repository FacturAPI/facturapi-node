import { AxiosInstance } from "axios";

export default class Receipts {
  client: AxiosInstance
  constructor (client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new receipt
   * @param {Object} data Receipt data
   * @returns {Promise} Receipt object
   */
  create (data: Record<string, any>) {
    return this.client.post('/receipts', data).then(response => response.data);
  }

  /**
   * Gets a paginated list of receipts that belong to your organization
   * @param {[Object]} params Search parameters
   * @returns {Promise} Search results object. The object contains a `data` property with the list of receipts.
   */
  list (params?: Record<string, any> | null) {
    if (!params) params = {};
    return this.client.get('/receipts', { params }).then(response => response.data);
  }

  /**
   * Gets a single receipt object
   * @param {string} id Receipt Id
   * @returns {Promise} Receipt object
   */
  retrieve (id: string) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/receipts/' + id).then(response => response.data);
  }

  /**
   * Creates an invoice for this receipt
   * @param {string} id Receipt Id
   * @param {Object} data Invoice data
   * @returns {Promise} Invoice object
   */
  invoice (id: string, data: Record<string, any>) {
    return this.client.post('/receipts/' + id + '/invoice', data).then(response => response.data);
  }

  /**
   * Creates a global invoice for open receipts
   * @param {Object} data
   * @returns {Promise}
   */
  createGlobalInvoice (data: Record<string, any>) {
    return this.client.post('/receipts/global-invoice', data).then(response => response.data);
  }

  /**
   * Marks a receipt as canceled. The receipt won't be available for invoicing anymore.
   * @param {string} id
   * @returns {Promise}
   */
  cancel (id: string) {
    return this.client.delete('/receipts/' + id).then(response => response.data);
  }

  /**
   * Sends the receipt to the customer's email
   * @param {String} id Receipt Id
   * @param {any} data Additional arguments
   * @param {String} data.email Email address to send the receipt to
   * @returns {Promise} Email sent confirmation
   */
  sendByEmail (id: string, data?: Record<string, any> | null) {
    return this.client.post('/receipts/' + id + '/email', data).then(response => response.data);
  }

  /**
   * Downloads the specified receipt in PDF format
   * @param {string} id Receipt Id
   * @returns {Promise<NodeJS.ReadableStream>} PDF file in a stream
   */
  downloadPdf (id: string): Promise<NodeJS.ReadableStream> {
    return this.client.get('/receipts/' + id + '/pdf', {
      responseType: 'stream'
    }).then(response => response.data);
  }
}

