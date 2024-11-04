import { AxiosInstance } from 'axios';
import {
  GenericResponse,
  Retention,
  SearchResult,
  SendEmailBody,
} from '../types';

export default class Retentions {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Creates a new valid retention (CFDI).
   * @param data
   * @returns
   */
  create(data: Record<string, any>): Promise<Retention> {
    return this.client
      .post('/retentions', data)
      .then((response) => response.data);
  }

  /**
   * Gets a paginated list of retentions created by the organization
   * @param params - Search parameters
   * @returns
   */
  list(params?: Record<string, any> | null): Promise<SearchResult<Retention>> {
    if (!params) params = {};
    return this.client
      .get('/retentions', { params })
      .then((response) => response.data);
  }

  /**
   * Gets a single retention object
   * @param id
   * @returns
   */
  retrieve(id: string): Promise<Retention> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client
      .get('/retentions/' + id)
      .then((response) => response.data);
  }

  /**
   * Cancels a retention.
   * @param id
   * @returns
   */
  cancel(id: string): Promise<Retention> {
    return this.client
      .delete('/retentions/' + id)
      .then((response) => response.data);
  }

  /**
   * Sends a retention to the customer's email
   * @param id Retention Id
   * @param data Additional arguments
   * @param data.email Email address to send the retention to
   * @returns
   */
  sendByEmail(id: string, data?: SendEmailBody): Promise<GenericResponse> {
    return this.client
      .post('/retentions/' + id + '/email', data)
      .then((response) => response.data);
  }

  /**
   * Downloads the specified retention in PDF format
   * @param id Retention Id
   * @returns PDF file in a stream
   */
  downloadPdf(id: string): Promise<NodeJS.ReadableStream> {
    return this.client
      .get('/retentions/' + id + '/pdf', {
        responseType: 'stream',
      })
      .then((response) => response.data);
  }

  /**
   * Downloads the specified retention in XML format
   * @param id Retention Id
   * @returns XML file in a stream
   */
  downloadXml(id: string): Promise<NodeJS.ReadableStream> {
    return this.client
      .get('/retentions/' + id + '/xml', {
        responseType: 'stream',
      })
      .then((response) => response.data);
  }

  /**
   * Downloads the specified retention in a ZIP package containing both PDF and XML files
   * @param id Retention Id
   * @returns ZIP file in a stream
   */
  downloadZip(id: string): Promise<NodeJS.ReadableStream> {
    return this.client
      .get('/retentions/' + id + '/zip', {
        responseType: 'stream',
      })
      .then((response) => response.data);
  }
}
