import { AxiosInstance } from "axios";

export default class Customers {
  client: AxiosInstance;
  constructor (client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new customer in your organization
   * @param {Object} data Customer data
   * @returns {Promise} Customer object
   */
  create (data: Record<string, any>) {
    return this.client.post('/customers', data).then(response => response.data);
  }

  /**
   * Gets a paginated list of customers that belong to your organization
   * @param {[Object]} params Search parameters
   * @returns {Promise} List of customers
   */
  list (params: Record<string, any>) {
    if (!params) params = {};
    return this.client.get('/customers', { params: params }).then(response => response.data);
  }

  /**
   * Gets a single customer object
   * @param {string} id Customer Id
   * @returns {Promise} Customer object
   */
  retrieve (id: string) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/customers/' + id).then(response => response.data);
  }

  /**
   * Updates a customer
   * @param {string} id Customer Id
   * @param {Object} data Customer data to update
   * @returns {Promise} Updated customer
   */
  update (id: string, data: Record<string, any>) {
    return this.client.put('/customers/' + id, data).then(response => response.data);
  }

  /**
   * Permanently removes a customer from your organization.
   * @param {string} id Customer Id
   * @returns {Promise} Deleted customer
   */
  del (id: string) {
    return this.client.delete('/customers/' + id).then(response => response.data);
  }

  /**
   * Validate customer with SAT validation.
   * @param {string} id Customer Id
   * @returns {Promise} Validation result
   */
  validateTaxInfo (id: string) {
    return this.client.get('/customers/' + id + '/tax-info-validation').then(response => response.data);
  }
}

