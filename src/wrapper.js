var constants = require('./constants');
var axios = require('axios');
var FormData = require('form-data');
var Buffer = require('safe-buffer').Buffer;

axios.defaults.baseURL = constants.BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
var responseInterceptor = function (response) {
  return response.data;
};
var errorInterceptor = function (error) {
  if (error.isAxiosError) {
    return Promise.reject(new Error(error.response.data.message));
  } else {
    return Promise.reject(new Error(error.message));
  }
};

function encodeStringToBase64 (text) {
  // Make sure text is a string
  text = text.toString();
  return Buffer.from(text).toString('base64');
}

class Wrapper {
  constructor (apiKey) {
    this.client = axios.create();
    this.client.interceptors.response.use(
      responseInterceptor,
      errorInterceptor
    );
    this.client.interceptors.request.use(function (config) {
      console.log({ config });
      return config;
    });
    this.t = 23;
    this.client.defaults.headers.common.Authorization =
      'Basic ' + encodeStringToBase64(apiKey + ':');
  }

  listCustomers (params) {
    if (!params) params = {};
    return this.client.get('/customers', { params: params });
  }

  /**
   * Gets a single customer object
   * @param {string} id
   */
  retrieveCustomer (id) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/customers/' + id);
  }

  /**
   * Creates a new customer in your organization
   * @param {Object} data
   */
  createCustomer (data) {
    return this.client.post('/customers', data);
  }

  /**
   * Updates a customer
   * @param {string} id
   * @param {Object} data
   */
  updateCustomer (id, data) {
    return this.client.put('/customers/' + id, data);
  }

  /**
   * Permanently removes a customer from your organization.
   * @param {string} id
   */
  removeCustomer (id) {
    return this.client.delete('/customers/' + id);
  }

  /**
   * Gets a paginated list of products that belong to your organization
   * @param {Object} params
   */
  listProducts (params) {
    if (!params) params = {};
    return this.client.get('/products', { params: params });
  }

  /**
   * Gets a single product object
   * @param {string} id
   */
  retrieveProduct (id) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/products/' + id);
  }

  /**
   * Creates a new product in your organization
   * @param {Object} data
   */
  createProduct (data) {
    return this.client.post('/products', data);
  }

  /**
   * Updates a product
   * @param {string} id
   * @param {object} data
   */
  updateProduct (id, data) {
    return this.client.put('/products/' + id, data);
  }

  /**
   * Permanently removes a product from your organization
   * @param {string} id
   */
  removeProduct (id) {
    return this.client.delete('/products/' + id);
  }

  /**
   * Searches product keys
   * @param {object} params
   */
  searchProducts (params) {
    return this.client.get('/catalogs/products', { params });
  }

  /**
   * Searches product units
   * @param {object} params
   */
  searchUnits (params) {
    return this.client.get('/catalogs/units', { params });
  }

  /**
   * Gets a paginated list of invoices created by your organization
   * @param {Object} params
   */
  listInvoices (params) {
    if (!params) params = {};
    return this.client.get('/invoices', { params });
  }

  /**
   * Gets a single invoice object
   * @param {string} id
   * @returns {Promise<Object>} Invoice object
   */
  retrieveInvoice (id) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/invoices/' + id);
  }

  /**
   * Creates a new valid invoice (CFDI).
   * @param {Object} data
   */
  createInvoice (data) {
    return this.client.post('/invoices', data);
  }

  /**
   * Cancels an invoice. The invoice will not be valid anymore and will change its status to canceled.
   * @param {string} id
   */
  cancelInvoice (id) {
    return this.client.delete('/invoices/' + id);
  }

  /**
   * Sends the invoice to the customer's email
   * @param {string} id Invoice Id
   * @param {Object} data
   * @param {string} data.email Email address to send the invoice to
   */
  sendInvoiceByEmail (id, data) {
    return this.client.post('/invoices/' + id + '/email', data);
  }

  /**
   * Downloads the specified invoice in PDF format
   * @param {string} id Invoice Id
   * @returns {Promise<ReadStream>} PDF file in a stream
   */
  downloadPdf (id) {
    return this.client.get('/invoices/' + id + '/pdf', {
      responseType: 'stream'
    });
  }

  /**
   * Downloads the specified invoice in XML format
   * @param {string} id Invoice Id
   * @returns {Promise<ReadStream>} XML file in a stream
   */
  downloadXml (id) {
    return this.client.get('/invoices/' + id + '/xml', {
      responseType: 'stream'
    });
  }

  /**
   * Downloads the specified invoice in a ZIP package containing both PDF and XML files
   * @param {string} id Invoice Id
   * @returns {Promise<ReadStream>} ZIP file in a stream
   */
  downloadZip (id) {
    return this.client.get('/invoices/' + id + '/zip', {
      responseType: 'stream'
    });
  }

  /**
   * Creates a new organization in your account
   * @param {Object} data
   */
  createOrganization (data) {
    return this.client.post('/organizations', data);
  }

  /**
   * Gets a paginated list of organizations that belong to your account
   * @param {Object} params
   */
  listOrganizations (params) {
    if (!params) params = {};
    return this.client.get('/organizations', { params: params });
  }

  /**
   * Gets a single organization object
   * @param {string} id
   */
  retrieveOrganization (id) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/organizations/' + id);
  }

  /**
   * Gets the api keys for an organization
   * @param {string} id
   */
  getOrganizationApiKeys (id) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/organizations/' + id + '/apikeys');
  }

  /**
   * Permanently removes an organization from your account.
   * @param {string} id
   */
  removeOrganization (id) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.delete('/organizations/' + id);
  }

  /**
   * Updates the organization's legal information
   * @param {string} id
   * @param {object} data
   */
  updateOrganizationLegal (id, data) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.put('/organizations/' + id + '/legal', data);
  }

  /**
   * Updates the organization's customization information
   * @param {string} id
   * @param {object} data
   */
  updateOrganizationCustomization (id, data) {
    return this.client.put('/organizations/' + id + '/customization', data);
  }

  /**
   * Uploads the organization's logo
   * @param {string} id
   * @param {ReadableStream|Buffer} file
   */
  uploadOrganizationLogo (id, file) {
    const formData = new FormData();
    formData.append('file', file, 'file');
    return this.client.put('/organizations/' + id + '/logo', formData, {
      headers: formData.getHeaders()
    });
  }

  /**
   * Uploads the organization's certificate (CSD)
   * @param {string} id
   * @param {ReadableStream|Buffer} cerFile
   * @param {ReadableStream|Buffer} keyFile
   * @param {string} password
   */
  uploadOrganizationCertificate (id, cerFile, keyFile, password) {
    const formData = new FormData();
    formData.append('cer', cerFile, { filename: 'cer.cer' });
    formData.append('key', keyFile, { filename: 'key.key' });
    formData.append('password', password);
    return this.client.put('/organizations/' + id + '/certificate', formData, {
      headers: formData.getHeaders()
    });
  }

  /**
   * Gets a paginated list of receipts created by your organization
   * @param {Object} params
   */
  listReceipts (params) {
    if (!params) params = {};
    return this.client.get('/receipts', { params });
  }

  /**
   * Gets a single receipt
   * @param {string} id
   * @returns {Promise<Object>} Receipt object
   */
  retrieveReceipt (id) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/receipts/' + id);
  }

  /**
   * Creates a new receipt.
   * @param {Object} data
   */
  createReceipt (data) {
    return this.client.post('/receipts', data);
  }

  /**
   * Cancels an receipt.
   * @param {string} id
   */
  cancelReceipt (id) {
    return this.client.delete('/receipts/' + id);
  }

  /**
   * Creates an invoice for an open receipt
   * @param {string} id
   * @param {object} data
   */
  invoiceReceipt (id, data) {
    return this.client.post('/receipts/' + id + '/invoice', data);
  }

  /**
   * Creates a global invoice for open receipts
   * @param {object} data
   */
  createGlobalInvoice (data) {
    return this.client.post('/receipts/global-invoice', data);
  }

  /**
   * Updates the organization's receipts settings
   * @param {string} id
   * @param {object} data
   */
  updateReceiptSettings (id, data) {
    return this.client.put('/organizations/' + id + '/receipts', data);
  }

  /**
   * Updates the organization's domain
   * @param {string} id
   * @param {object} data
   */
  updateDomain (id, data) {
    return this.client.put('/organizations/' + id + '/domain', data);
  }

  /**
   * Checks if a domain is available for self invoices
   * @param {object} data
   */
  checkDomainIsAvailable (data) {
    return this.client.put('/organizations/domain-check', data);
  }
}

module.exports = Wrapper;
