import { AxiosInstance } from 'axios';
import { ApiEvent, ApiEventType, Webhook } from '../types/webhook';
import { SearchResult } from '../types';

export default class Webhooks {
  client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new webhook in your organization
   * @param data - Webhook options
   * @returns Webhook object
   */
  create(data: Record<string, any>): Webhook {
    return this.client.post('/webhooks', data);
  }

  /**
   * Gets a paginated list of webhooks that belong to your organization
   * @param params - Search parameters
   * @returns Search results object. The object contains a `data` property with the list of webhooks.
   */
  list(params: Record<string, any>): Promise<SearchResult<Webhook>> {
    if (!params) {
      params = {};
    }
    return this.client.get('/webhooks', { params });
  }

  /**
   * Gets a single webhook object
   * @param id - Webhook Id
   * @returns Webhook object
   */
  retrieve(id: string): Promise<Webhook> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/webhooks/' + id);
  }

  /**
   * Updates a webhook
   * @param id - Webhook Id
   * @param data Updated webhook data
   * @returns
   */
  update(id: string, data: Record<string, any>): Promise<Webhook> {
    return this.client.put('/webhooks/' + id, data);
  }

  /**
   * Permanently removes a webhook from your organization.
   * @param id - Webhook Id
   * @returns Deleted webhook
   */
  del(id: string): Promise<Webhook> {
    return this.client.delete('/webhooks/' + id);
  }

  /**
   * Validate the response of webhook with the secret and facturapi-signature
   * @param secret - Webhook Secret, received in the webhook creation
   * @param signature - Facturapi Signature Header
   * @param payload - Received event object to validate
   * @returns When the signature is valid, it returns the event object
   */
  async validateSignature<T extends ApiEventType | '' = ''>(data: {
    secret: string;
    signature: string;
    payload: ApiEvent<T>;
  }): Promise<ApiEvent<T>> {
    return this.client.post('/webhooks/validate-signature', data);
  }
}
