import { AxiosInstance } from "axios";

export default class Webhooks {
    client: AxiosInstance;

    constructor (client: AxiosInstance) {
      this.client = client;
    }
  
    /**
     * Creates a new webhook in your organization
     * @param {Object} data - Webhook options
     * @returns {Promise} Webhook object
     */
    create (data: Record<string, any>) {
      return this.client.post('/webhooks', data);
    }
  
    /**
     * Gets a paginated list of webhooks that belong to your organization
     * @param {[Object]} params - Search parameters
     * @returns {Promise} Search results object. The object contains a `data` property with the list of webhooks.
     */
    list (params: Record<string, any>) {
      if (!params) params = {};
      return this.client.get('/webhooks', { params: params });
    }
  
    /**
     * Gets a single webhook object
     * @param {string} id - Webhook Id
     * @returns {Promise} Webhook object
     */
    retrieve (id: string) {
      if (!id) return Promise.reject(new Error('id is required'));
      return this.client.get('/webhooks/' + id);
    }
  
    /**
     * Updates a webhook
     * @param {string} id - Webhook Id
     * @param {Object} data Updated webhook data
     * @returns {Promise}
     */
    update (id: string, data: Record<string, any>) {
      return this.client.put('/webhooks/' + id, data);
    }
  
    /**
     * Permanently removes a webhook from your organization.
     * @param {string} id - Webhook Id
     * @returns {Promise} Deleted webhook
     */
    del (id: string) {
      return this.client.delete('/webhooks/' + id);
    }

  }
  
