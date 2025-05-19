import { isNode, isReactNative } from '../constants';
import { SearchResult, Webhook, ApiEvent, ApiEventType } from '../types';
import { WrapperClient } from '../wrapper';

export default class Webhooks {
  client: WrapperClient;

  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Creates a new webhook in your organization
   * @param data - Webhook options
   * @returns Webhook object
   */
  create(data: Record<string, any>): Promise<Webhook> {
    return this.client.post('/webhooks', { body: data });
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
    return this.client.put('/webhooks/' + id, { body: data });
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
  async validateSignature<T extends ApiEventType = any>(data: {
    secret: string;
    signature: string;
    payload: string | Buffer | ApiEvent<T>;
  }): Promise<ApiEvent<T>> {
    // Validated locally
    const { secret, signature, payload } = data;
    let payloadString: string;
    if (typeof payload === 'string') {
      payloadString = payload;
    } else if (Buffer.isBuffer(payload)) {
      payloadString = payload.toString('utf8');
    } else if (typeof payload === 'object') {
      payloadString = JSON.stringify(payload);
    } else {
      throw new Error('Invalid payload type');
    }

    if (isReactNative) {
      // Call the API to validate signature in React Native
      return this.client.post('/webhooks/validate-signature', {
        body: {
          secret,
          signature,
          payload: payloadString,
        },
      });
    } else if (isNode) {
      const crypto = await import('crypto');
      const hmac = crypto.createHmac('sha256', secret);
      const digestBuffer = hmac
        .update(payloadString)
        .digest();
      // Compare the digest with the signature and prevent timing attacks
      // by using a constant-time comparison
      const signatureBuffer = Buffer.from(signature, 'hex');
      if (digestBuffer.length !== signatureBuffer.length) {
        throw new Error('Invalid signature');
      }
      const isValid = crypto.timingSafeEqual(digestBuffer, signatureBuffer);
      if (!isValid) {
        throw new Error('Invalid signature');
      }
      return JSON.parse(payloadString) as ApiEvent<T>;
    } else { // Web browsers
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(payloadString);
      const encodedSecret = encoder.encode(secret);
      const digest = await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey(
          'raw',
          encodedSecret,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign'],
        ),
        encodedData,
      );
      const hexDigest = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase();
      if (signature !== hexDigest) {
        throw new Error('Invalid signature');
      }
    }
    return JSON.parse(payloadString) as ApiEvent<T>;
  }
}
