import { Customer, SearchResult, TaxInfoValidation } from '../types';
import { WrapperClient } from '../wrapper';

export default class Customers {
  client: WrapperClient;
  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Creates a new customer in your organization
   * @param data Customer data
   * @param params Query params
   * @returns Customer object
   */
  create(
    data: Record<string, any>,
    params: Record<string, any> | null = null,
  ): Promise<Customer> {
    return this.client.post('/customers', { body: data, params });
  }

  /**
   * Gets a paginated list of customers that belong to your organization
   * @param params Search parameters
   * @returns List of customers
   */
  list(params: Record<string, any>): Promise<SearchResult<Customer>> {
    if (!params) params = {};
    return this.client.get('/customers', { params: params });
  }

  /**
   * Gets a single customer object
   * @param id Customer Id
   * @returns Customer object
   */
  retrieve(id: string): Promise<Customer> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/customers/' + id);
  }

  /**
   * Updates a customer
   * @param id Customer Id
   * @param data Customer data to update
   * @param params Query params
   * @returns Updated customer
   */
  update(
    id: string,
    data: Record<string, any>,
    params: Record<string, any> | null = null,
  ): Promise<Customer> {
    return this.client.put('/customers/' + id, { body: data, params });
  }

  /**
   * Permanently removes a customer from your organization.
   * @param id Customer Id
   * @returns Deleted customer
   */
  del(id: string): Promise<Customer> {
    return this.client.delete('/customers/' + id);
  }

  /**
   * Validate customer with SAT validation.
   * @param id Customer Id
   * @returns Validation result
   */
  validateTaxInfo(id: string): Promise<TaxInfoValidation> {
    return this.client.get('/customers/' + id + '/tax-info-validation');
  }
}
