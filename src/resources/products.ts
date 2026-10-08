import { Product, SearchResult } from '../types';
import { WrapperClient } from '../wrapper';

export default class Products {
  client: WrapperClient;
  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Creates a new product in your organization
   * @param data - Product data
   * @returns Product object
   */
  create(data: Record<string, any>): Promise<Product> {
    return this.client.post('/products', { body: data });
  }

  /**
   * Gets a paginated list of products that belong to your organization
   * @param params - Search parameters
   * @returns Search results object. The object contains a `data` property with the list of products.
   */
  list(params?: Record<string, any> | null): Promise<SearchResult<Product>> {
    return this.client.get('/products', { params: params });
  }

  /**
   * Gets a single product object
   * @param id - Product Id
   * @returns Product object
   */
  retrieve(id: string): Promise<Product> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/products/' + id);
  }

  /**
   * Updates a product
   * @param id - Product Id
   * @param data - Product data to update
   * @returns Updated product
   */
  update(id: string, data: Record<string, any>): Promise<Product> {
    return this.client.put('/products/' + id, { body: data });
  }

  /**
   * Permanently removes a product from your organization.
   * @param id - Product Id
   * @returns Deleted product
   */
  del(id: string): Promise<Product> {
    return this.client.delete('/products/' + id);
  }
}
