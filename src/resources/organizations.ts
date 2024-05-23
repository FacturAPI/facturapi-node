import { AxiosInstance } from "axios";
import * as FormData from 'form-data';

export default class Organizations {
  client: AxiosInstance
  constructor (client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new organization for your account
   * @param {Object} data - Organization data
   * @returns {Promise} Organization object
   */
  create (data: Record<string, any>) {
    return this.client.post('/organizations', data).then(r => r.data);
  }

  /**
   * Gets a paginated list of organizations that belong to your account
   * @param {[Object]} params - Search parameters
   * @returns {Promise} Search results object. The object contains a `data` property with the list of organizations.
   */
  list (params?: Record<string, any> | null) {
    if (!params) params = {};
    return this.client.get('/organizations', { params: params }).then(r => r.data);
  }

  /**
   * Gets a single organization object
   * @param {string} id
   * @returns {Promise}
   */
  retrieve (id: string) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/organizations/' + id).then(r => r.data);
  }

  /**
   * Updates the organization's legal information
   * @param {string} id Organization Id
   * @param {Object} data
   * @returns {Promise}
   */
  updateLegal (id: string, data: Record<string, any>) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.put('/organizations/' + id + '/legal', data).then(r => r.data);
  }

  /**
   * Updates the organization's customization information
   * @param {string} id Organization Id
   * @param {Object} data Customization settings
   * @returns {Promise} Organization object
   */
  updateCustomization (id: string, data: Record<string, any>) {
    return this.client.put('/organizations/' + id + '/customization', data).then(r => r.data);
  }

  /**
   * Updates the organization's customization information
   * @param {string} id Organization Id
   * @param {Object} data Receipt settings
   * @returns {Promise} Organization object
   */
  updateReceiptSettings (id: string, data: Record<string, any>) {
    return this.client.put('/organizations/' + id + '/receipts', data).then(r => r.data);
  }

  /**
   * Updates the organization's customization information
   * @param {string} id Organization Id
   * @param {Object} data Domain data
   * @returns {Promise} Organization object
   */
  updateDomain (id: string, data: Record<string, any>) {
    return this.client.put('/organizations/' + id + '/domain', data).then(r => r.data);
  }

  /**
   * Checks if a domain is available for self invoices
   * @param {object} data Domain data
   * @returns {Promise<{ available: boolean }>} Domain availability
   */
  checkDomainIsAvailable (data: Record<string, any>) {
    return this.client.put('/organizations/domain-check', data).then(r => r.data);
  }

  /**
   * Uploads the organization's logo
   * @param {string} id Organization Id
   * @param {NodeJS.ReadableStream} file Logo file
   * @returns {Promise} Organization object
   */
  uploadLogo (id: string, file: NodeJS.ReadableStream) {
    const formData = new FormData();
    formData.append('file', file, 'file');
    return this.client.put('/organizations/' + id + '/logo', formData, {
      headers: formData.getHeaders()
    }).then(r => r.data);
  }

  /**
   * Uploads the organization's certificate (CSD)
   * @param {string} id Organization Id
   * @param {NodeJS.ReadableStream} cerFile Certificate file
   * @param {NodeJS.ReadableStream} keyFile Key file
   * @param {string} password Certificate password
   * @returns {Promise} Organization object
   */
  uploadCertificate (id: string, cerFile: NodeJS.ReadableStream, keyFile: NodeJS.ReadableStream, password: string) {
    const formData = new FormData();
    formData.append('cer', cerFile, { filename: 'cer.cer' });
    formData.append('key', keyFile, { filename: 'key.key' });
    formData.append('password', password);
    return this.client.put('/organizations/' + id + '/certificate', formData, {
      headers: formData.getHeaders()
    }).then(r => r.data);
  }

  /**
   * Deletes the organization's certificate (CSD)
   * @param {string} id Organization Id
   * @returns {Promise} Organization object
   */
    deleteCertificate (id: string) {
      return this.client.delete('/organizations/' + id + '/certificate').then(r => r.data);
  }


  /**
   * Permanently removes a organization from your account.
   * @param {string} id Organization Id
   * @returns {Promise<void>} Deleted organization object
   */
  del (id: string) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.delete('/organizations/' + id).then(r => r.data);
  }

  /**
   * Gets the test api key for an organization
   * @param {string} id Organization Id
   * @returns {Promise<string>} Test api key
   */
  getTestApiKey (id: string) {
    return this.client.get('/organizations/' + id + '/apikeys/test').then(r => r.data);
  }

  /**
   * Renews the test api key and makes the previous one unusable
   * @param {string} id Organization Id
   * @returns {Promise<string>} New test api key
   */
  renewTestApiKey (id: string) {
    return this.client.put('/organizations/' + id + '/apikeys/test').then(r => r.data);
  }

  /**
   * Renews the live api key and makes the previous one unusable
   * @param {string} id Organization Id
   * @returns {Promise<string>} New live api key
   */
  renewLiveApiKey (id: string) {
    return this.client.put('/organizations/' + id + '/apikeys/live').then(r => r.data);
  }
}
