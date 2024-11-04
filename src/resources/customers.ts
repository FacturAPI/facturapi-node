import { AxiosInstance } from 'axios';
import { Customer, SearchResult, TaxInfoValidation } from '../types';

export default class Customers {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new customer in your organization
   * @param data Customer data
   * @returns Customer object
   */
  create(data: Record<string, any>): Promise<Customer> {
    return this.client
      .post('/customers', data)
      .then((response) => response.data);
  }

  /**
   * Gets a paginated list of customers that belong to your organization
   * @param params Search parameters
   * @returns List of customers
   */
  list(params: Record<string, any>): Promise<SearchResult<Customer>> {
    if (!params) params = {};
    return this.client
      .get('/customers', { params: params })
      .then((response) => response.data);
  }

  /**
   * Gets a single customer object
   * @param id Customer Id
   * @returns Customer object
   */
  retrieve(id: string): Promise<Customer> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client
      .get('/customers/' + id)
      .then((response) => response.data);
  }

  /**
   * Updates a customer
   * @param id Customer Id
   * @param data Customer data to update
   * @returns Updated customer
   */
  update(id: string, data: Record<string, any>): Promise<Customer> {
    return this.client
      .put('/customers/' + id, data)
      .then((response) => response.data);
  }

  /**
   * Permanently removes a customer from your organization.
   * @param id Customer Id
   * @returns Deleted customer
   */
  del(id: string): Promise<Customer> {
    return this.client
      .delete('/customers/' + id)
      .then((response) => response.data);
  }

  /**
   * Validate customer with SAT validation.
   * @param id Customer Id
   * @returns Validation result
   */
  validateTaxInfo(id: string): Promise<TaxInfoValidation> {
    return this.client
      .get('/customers/' + id + '/tax-info-validation')
      .then((response) => response.data);
  }
}
