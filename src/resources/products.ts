import { AxiosInstance } from "axios";

export default class Products {
  client: AxiosInstance;
  constructor (client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new product in your organization
   * @param {Object} data - Product data
   * @returns {Promise} Product object
   */
  create (data: Record<string, any>) {
    return this.client.post('/products', data).then(r => r.data);
  }

  /**
   * Gets a paginated list of products that belong to your organization
   * @param {[Object]} params - Search parameters
   * @returns {Promise} Search results object. The object contains a `data` property with the list of products.
   */
  list (params?: Record<string, any> | null) {
    return this.client.get('/products', { params: params }).then(r => r.data);
  }

  /**
   * Gets a single product object
   * @param {string} id - Product Id
   * @returns {Promise} Product object
   */
  retrieve (id: string) {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/products/' + id).then(r => r.data);
  }

  /**
   * Updates a product
   * @param {string} id - Product Id
   * @param {Object} data - Product data to update
   * @returns {Promise} Updated product
   */
  update (id: string, data: Record<string, any>) {
    return this.client.put('/products/' + id, data).then(r => r.data);
  }

  /**
   * Permanently removes a product from your organization.
   * @param {string} id - Product Id
   * @returns {Promise} Deleted product
   */
  del (id: string) {
    return this.client.delete('/products/' + id).then(r => r.data);
  }
}
