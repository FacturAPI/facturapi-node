var constants = require('./constants');
var axios = require('axios');

axios.defaults.baseURL = constants.BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error.response.data);
});

function encodeStringToBase64 (text) {
  // Make sure text is a string
  text = text.toString();
  // Check if this node.js version supports the safe method to create buffers
  if (Buffer.allocUnsafe) {
    return Buffer.from(text).toString('base64');
  } else {
    return new Buffer(text).toString('base64');
  }
}

class Wrapper {
  constructor (apiKey) {
    this.client = axios.create();
    this.client.defaults.headers.common['Authorization'] = 'Basic ' + encodeStringToBase64(apiKey + ':');
  }
  /**
   * Gets a paginated list of customers that belong to your organization
   * @param {Object} params
   */
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
   * Gets a paginated list of invoices created by your organization
   * @param {Object} params
   */
  listInvoices (params) {
    if (!params) params = {};
    return this.client.get('/invoices', { params: params });
  }
  /**
   * Gets a single invoice object
   * @param {string} id
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
}

module.exports = Wrapper;
