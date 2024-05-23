import { AxiosInstance } from "axios";

export default class Retentions {
  client: AxiosInstance;
  constructor (client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new valid retention (CFDI).
   * @param {Object} data
   * @returns {Promise}
   */
  create (data: Record<string, any>) {
    return this.client.post('/retentions', data).then(response => response.data);
  }

  /**
   * Gets a paginated list of retentions created by the organization
   * @param {[Object]} params - Search parameters
   * @returns {Promise}
   */
  list (params?: Record<string, any> | null) {
    if (!params) params = {};
    return this.client.get('/retentions', { params }).then(response => response.data);
  }

  /**
   * Gets a single retention object
   * @param {string} id
   * @returns {Promise}
   */
  retrieve (id: string) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/retentions/' + id).then(response => response.data);
  }

  /**
   * Cancels a retention.
   * @param {string} id
   * @returns {Promise}
   */
  cancel (id: string) {
    return this.client.delete('/retentions/' + id).then(response => response.data);
  }

  /**
   * Sends a retention to the customer's email
   * @param {String} id Retention Id
   * @param {Object} data Additional arguments
   * @param {String} data.email Email address to send the retention to
   * @returns {Promise}
   */
  sendByEmail (id: string, data?: Record<string, any> | null) {
    return this.client.post('/retentions/' + id + '/email', data).then(response => response.data);
  }

  /**
   * Downloads the specified retention in PDF format
   * @param {string} id Retention Id
   * @returns {Promise<NodeJS.ReadableStream>} PDF file in a stream
   */
  downloadPdf (id: string): Promise<NodeJS.ReadableStream> {
    return this.client.get('/retentions/' + id + '/pdf', {
      responseType: 'stream'
    }).then(response => response.data);
  }

  /**
   * Downloads the specified retention in XML format
   * @param {string} id Retention Id
   * @returns {Promise<NodeJS.ReadableStream>} XML file in a stream
   */
  downloadXml (id: string): Promise<NodeJS.ReadableStream> {
    return this.client.get('/retentions/' + id + '/xml', {
      responseType: 'stream'
    }).then(response => response.data);
  }

  /**
   * Downloads the specified retention in a ZIP package containing both PDF and XML files
   * @param {string} id Retention Id
   * @returns {Promise<NodeJS.ReadableStream>} ZIP file in a stream
   */
  downloadZip (id: string): Promise<NodeJS.ReadableStream> {
    return this.client.get('/retentions/' + id + '/zip', {
      responseType: 'stream'
    }).then(response => response.data);
  }
}
