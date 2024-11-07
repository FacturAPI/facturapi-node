import { WrapperClient, NodeFormData, UniversalFormData } from '../wrapper';
import type { ApiKeys, Organization, Series } from '../types/organization';
import { SearchResult } from '../types/common';
import { isNode } from '../constants';

export default class Organizations {
  client: WrapperClient;
  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Creates a new organization for your account
   * @param data - Organization data
   * @returns Organization object
   */
  create(data: Record<string, any>): Promise<Organization> {
    return this.client.post('/organizations', { body: data });
  }

  /**
   * Gets a paginated list of organizations that belong to your account
   * @param params - Search parameters
   * @returns Search results object. The object contains a `data` property with the list of organizations.
   */
  list(
    params?: Record<string, any> | null,
  ): Promise<SearchResult<Organization>> {
    if (!params) params = {};
    return this.client.get('/organizations', { params: params });
  }

  /**
   * Gets a single organization object
   * @param id
   * @returns
   */
  retrieve(id: string): Promise<Organization> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.get('/organizations/' + id);
  }

  /**
   * Updates the organization's legal information
   * @param id Organization Id
   * @param data
   * @returns
   */
  updateLegal(id: string, data: Record<string, any>): Promise<Organization> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.put('/organizations/' + id + '/legal', { body: data });
  }

  /**
   * Updates the organization's customization information
   * @param id Organization Id
   * @param data Customization settings
   * @returns Organization object
   */
  updateCustomization(
    id: string,
    data: Record<string, any>,
  ): Promise<Organization> {
    return this.client.put('/organizations/' + id + '/customization', {
      body: data,
    });
  }

  /**
   * Updates the organization's customization information
   * @param id Organization Id
   * @param data Receipt settings
   * @returns Organization object
   */
  updateReceiptSettings(
    id: string,
    data: Record<string, any>,
  ): Promise<Organization> {
    return this.client.put('/organizations/' + id + '/receipts', {
      body: data,
    });
  }

  /**
   * Updates the organization's customization information
   * @param id Organization Id
   * @param data Domain data
   * @returns Organization object
   */
  updateDomain(id: string, data: Record<string, any>): Promise<Organization> {
    return this.client.put('/organizations/' + id + '/domain', { body: data });
  }

  /**
   * Checks if a domain is available for self invoices
   * @param data Domain data
   * @returns Domain availability
   */
  checkDomainIsAvailable(
    data: Record<string, any>,
  ): Promise<{ available: boolean }> {
    return this.client.put('/organizations/domain-check', { body: data });
  }

  /**
   * Uploads the organization's logo
   * @param id Organization Id
   * @param file Logo file
   * @returns Organization object
   */
  uploadLogo(
    id: string,
    file: NodeJS.ReadableStream | Buffer | File | Blob,
  ): Promise<Organization> {
    const formData: UniversalFormData = new (
      isNode ? NodeFormData : FormData
    )();
    if (isNode) {
      (formData as InstanceType<NodeFormData>).append('file', file, {
        filename: 'file',
        contentType: 'application/octet-stream',
      });
    } else {
      formData.append('file', file as File | Blob, 'file');
    }
    return this.client.put('/organizations/' + id + '/logo', { formData });
  }

  /**
   * Uploads the organization's certificate (CSD)
   * @param id Organization Id
   * @param cerFile Certificate file
   * @param keyFile Key file
   * @param password Certificate password
   * @returns Organization object
   */
  uploadCertificate(
    id: string,
    cerFile: NodeJS.ReadableStream | Buffer | File | Blob,
    keyFile: NodeJS.ReadableStream | Buffer | File | Blob,
    password: string,
  ): Promise<Organization> {
    const formData = new (isNode ? NodeFormData : FormData)();
    if (isNode) {
      (formData as InstanceType<NodeFormData>).append('cer', cerFile, {
        filename: 'cer.cer',
        contentType: 'application/octet-stream',
      });
    } else {
      formData.append('cer', cerFile as File | Blob, 'cer.cer');
    }
    if (isNode) {
      (formData as InstanceType<NodeFormData>).append('key', keyFile, {
        filename: 'key.key',
        contentType: 'application/octet-stream',
      });
    } else {
      formData.append('key', keyFile as File | Blob, 'key.key');
    }
    formData.append('password', password);
    return this.client.put('/organizations/' + id + '/certificate', {
      formData,
    });
  }

  /**
   * Deletes the organization's certificate (CSD)
   * @param id Organization Id
   * @returns Organization object
   */
  deleteCertificate(id: string): Promise<Organization> {
    return this.client.delete('/organizations/' + id + '/certificate');
  }

  /**
   * Permanently removes a organization from your account.
   * @param id Organization Id
   * @returns Deleted organization object
   */
  del(id: string): Promise<Organization> {
    if (!id) return Promise.reject(new Error('id is required'));
    return this.client.delete('/organizations/' + id);
  }

  /**
   * Gets the test api key for an organization
   * @param id Organization Id
   * @returns Test api key
   */
  getTestApiKey(id: string): Promise<string> {
    return this.client.get('/organizations/' + id + '/apikeys/test');
  }

  /**
   * Renews the test api key and makes the previous one unusable
   * @param id Organization Id
   * @returns New test api key
   */
  renewTestApiKey(id: string): Promise<string> {
    return this.client.put('/organizations/' + id + '/apikeys/test');
  }

  /**
   * List live api keys
   * @param id Organization Id
   * @returns List of live api keys
   */
  async listLiveApiKeys(id: string): Promise<ApiKeys[]> {
    return this.client.get('/organizations/' + id + '/apikeys/live');
  }

  /**
   * Renews the live api key and makes the previous one unusable
   * @param id Organization Id
   * @returns New live api key
   */
  renewLiveApiKey(id: string): Promise<string> {
    return this.client.put('/organizations/' + id + '/apikeys/live');
  }

  /**
   * Delete a live api key
   * @param organizationId Organization Id
   * @param apiKeyId Api Key Id
   * @returns List of live api keys
   */
  async deleteLiveApiKey(
    organizationId: string,
    apiKeyId: string,
  ): Promise<ApiKeys[]> {
    return this.client.delete(
      '/organizations/' + organizationId + '/apikeys/live/' + apiKeyId,
    );
  }

  /**
   * Get list of Series Organization
   * @param organization_id Organization Id
   * @returns Series object
   */
  listSeriesGroup(organization_id: string): Promise<Series[]> {
    return this.client.get(
      '/organizations/' + organization_id + '/series-group',
    );
  }

  /**
   * Creates a Series Organization
   * @param organization_id Organization Id
   * @param seriesData - Series data
   * @returns Series object
   */
  createSeriesGroup(
    organization_id: string,
    seriesData: Series,
  ): Promise<Series> {
    return this.client.post(
      '/organizations/' + organization_id + '/series-group',
      {
        body: seriesData,
      },
    );
  }

  /**
   * Update a Series Organization
   * @param organization_id Organization Id
   * @param seriesName Series seriesName
   * @param data - Series data
   * @returns Series object
   */
  updateSeriesGroup(
    organization_id: string,
    seriesName: string,
    data: Pick<Series, 'next_folio' | 'next_folio_test'>,
  ): Promise<Series> {
    return this.client.put(
      `/organizations/${organization_id}/series-group/${seriesName}`,
      {
        body: data,
      },
    );
  }

  /**
   * Update a Series Organization
   * @param organization_id Organization Id
   * @param seriesName Series seriesName
   * @returns Series object
   */
  deleteSeriesGroup(
    organization_id: string,
    seriesName: string,
  ): Promise<Series> {
    return this.client.delete(
      `/organizations/${organization_id}/series-group/${seriesName}`,
    );
  }
}
