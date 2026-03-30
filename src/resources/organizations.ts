import { WrapperClient } from '../wrapper';
import type {
  ApiKeys,
  Organization,
  OrganizationInvite,
  OrganizationInviteCreateInput,
  OrganizationInviteResponseInput,
  OrganizationTeamRole,
  OrganizationTeamRoleCreateInput,
  OrganizationTeamRoleTemplate,
  OrganizationTeamRoleUpdateInput,
  OrganizationUserAccess,
  Series,
} from '../types/organization';
import type { BinaryInput, NodeLikeReadableStream } from '../types';
import { SearchResult } from '../types/common';
import { streamToBuffer } from '../utils/streamToBuffer';

function isBuffer(value: unknown): value is Uint8Array {
  return typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
}

function isNodeLikeReadableStream(value: unknown): value is NodeLikeReadableStream {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as NodeLikeReadableStream).on === 'function'
  );
}

function toArrayBufferUint8Array(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  return new Uint8Array(arrayBuffer);
}

function toBlobPartUint8Array(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  return toArrayBufferUint8Array(bytes);
}

const prepareFile = async (
  file: BinaryInput,
  fileType: string,
): Promise<Blob | File> => {
  if (typeof Blob === 'undefined') {
    throw new Error(
      'Blob is not available in this runtime. Use Node.js 18+ or provide a Blob implementation.',
    );
  }
  if (file instanceof Blob) return file;
  if (typeof File !== 'undefined' && file instanceof File) return file;
  if (file instanceof ArrayBuffer) return new Blob([file], { type: fileType });
  if (file instanceof Uint8Array || isBuffer(file)) {
    return new Blob([toArrayBufferUint8Array(new Uint8Array(file))], {
      type: fileType,
    });
  }

  if (isNodeLikeReadableStream(file)) {
    const buffer = await streamToBuffer(file);
    return new Blob([toBlobPartUint8Array(buffer)], {
      type: fileType,
    });
  }

  const type = file === null ? 'null' : typeof file;
  const constructorName = (
    file &&
    typeof file === 'object' &&
    'constructor' in file &&
    (file as { constructor?: { name?: string } }).constructor?.name
  )
    ? ` (${(file as { constructor: { name: string } }).constructor.name})`
    : '';
  throw new Error(`Unsupported file input type: ${type}${constructorName}`);
};
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
  async uploadLogo(
    id: string,
    file: BinaryInput,
  ): Promise<Organization> {
    if (typeof FormData === 'undefined') {
      throw new Error(
        'FormData is not available in this runtime. Use Node.js 18+ or provide a FormData implementation.',
      );
    }
    const preparedFile = await prepareFile(
      file,
      'application/octet-stream',
    );
    const formData = new FormData();
    formData.append('file', preparedFile, 'file');
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
  async uploadCertificate(
    id: string,
    cerFile: BinaryInput,
    keyFile: BinaryInput,
    password: string,
  ): Promise<Organization> {
    if (typeof FormData === 'undefined') {
      throw new Error(
        'FormData is not available in this runtime. Use Node.js 18+ or provide a FormData implementation.',
      );
    }
    const formData = new FormData();
    const [cerFileOrBlob, keyFileOrBlob] = await Promise.all([
      prepareFile(cerFile, 'application/octet-stream'),
      prepareFile(keyFile, 'application/octet-stream'),
    ]);

    formData.append('cer', cerFileOrBlob, 'cer.cer');
    formData.append('key', keyFileOrBlob, 'key.key');
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

  /**
   * Get the organization that belongs to the authenticated API key
   * @returns Organization object
   */
  me(): Promise<Organization> {
    return this.client.get('/organizations/me');
  }

  /**
   * Updates the organization's self-invoice settings
   * @param id Organization Id
   * @param data Self-invoice settings
   * @returns Organization object
   */
  updateSelfInvoiceSettings(
    id: string,
    data: Record<string, any>,
  ): Promise<Organization> {
    return this.client.put('/organizations/' + id + '/self-invoice', {
      body: data,
    });
  }

  /**
   * Lists users with access to an organization.
   * @param organizationId Organization Id
   * @returns Array of organization access objects
   */
  listTeamAccess(organizationId: string): Promise<OrganizationUserAccess[]> {
    return this.client.get('/organizations/' + organizationId + '/team');
  }

  /**
   * Retrieves a specific user access in an organization.
   * @param organizationId Organization Id
   * @param accessId Access Id
   * @returns Organization access object
   */
  retrieveTeamAccess(
    organizationId: string,
    accessId: string,
  ): Promise<OrganizationUserAccess> {
    return this.client.get(
      '/organizations/' + organizationId + '/team/' + accessId,
    );
  }

  /**
   * Reassigns role for a specific access in an organization.
   * @param organizationId Organization Id
   * @param accessId Access Id
   * @param role Role Id
   * @returns Updated organization access object
   */
  updateTeamAccessRole(
    organizationId: string,
    accessId: string,
    role: string,
  ): Promise<OrganizationUserAccess> {
    return this.client.put(
      '/organizations/' + organizationId + '/team/' + accessId + '/role',
      {
        body: { role },
      },
    );
  }

  /**
   * Removes user access from an organization.
   * @param organizationId Organization Id
   * @param accessId Access Id
   * @returns Ok response
   */
  removeTeamAccess(
    organizationId: string,
    accessId: string,
  ): Promise<{ ok: boolean }> {
    return this.client.delete(
      '/organizations/' + organizationId + '/team/' + accessId,
    );
  }

  /**
   * Lists invites sent from an organization.
   * @param organizationId Organization Id
   * @returns Array of organization invite objects
   */
  listSentTeamInvites(organizationId: string): Promise<OrganizationInvite[]> {
    return this.client.get('/organizations/' + organizationId + '/team/invites');
  }

  /**
   * Creates or updates an invite for an organization.
   * @param organizationId Organization Id
   * @param data Invite payload
   * @returns Organization invite object
   */
  inviteUserToTeam(
    organizationId: string,
    data: OrganizationInviteCreateInput,
  ): Promise<OrganizationInvite> {
    return this.client.post('/organizations/' + organizationId + '/team/invites', {
      body: data,
    });
  }

  /**
   * Cancels a sent invite.
   * @param organizationId Organization Id
   * @param inviteKey Invite Key
   * @returns Ok response
   */
  cancelTeamInvite(
    organizationId: string,
    inviteKey: string,
  ): Promise<{ ok: boolean }> {
    return this.client.delete(
      '/organizations/' + organizationId + '/team/invites/' + inviteKey,
    );
  }

  /**
   * Lists pending invites received by authenticated user.
   * @returns Array of organization invite objects
   */
  listReceivedTeamInvites(): Promise<OrganizationInvite[]> {
    return this.client.get('/organizations/invites/pending');
  }

  /**
   * Accepts or rejects an invite.
   * @param inviteKey Invite Key
   * @param data Invite response payload
   * @returns Ok response
   */
  respondTeamInvite(
    inviteKey: string,
    data: OrganizationInviteResponseInput,
  ): Promise<{ ok: boolean }> {
    return this.client.post('/organizations/invites/' + inviteKey + '/response', {
      body: data,
    });
  }

  /**
   * Lists organization roles.
   * @param organizationId Organization Id
   * @returns Array of organization role objects
   */
  listTeamRoles(organizationId: string): Promise<OrganizationTeamRole[]> {
    return this.client.get('/organizations/' + organizationId + '/team/roles');
  }

  /**
   * Lists role templates for organization scope.
   * @param organizationId Organization Id
   * @returns Array of organization role templates
   */
  listTeamRoleTemplates(
    organizationId: string,
  ): Promise<OrganizationTeamRoleTemplate[]> {
    return this.client.get(
      '/organizations/' + organizationId + '/team/roles/templates',
    );
  }

  /**
   * Lists available operation codes for organization roles.
   * @param organizationId Organization Id
   * @returns Array of operation codes
   */
  listTeamRoleOperations(organizationId: string): Promise<string[]> {
    return this.client.get(
      '/organizations/' + organizationId + '/team/roles/operations',
    );
  }

  /**
   * Retrieves an organization role.
   * @param organizationId Organization Id
   * @param roleId Role Id
   * @returns Organization role object
   */
  retrieveTeamRole(
    organizationId: string,
    roleId: string,
  ): Promise<OrganizationTeamRole> {
    return this.client.get(
      '/organizations/' + organizationId + '/team/roles/' + roleId,
    );
  }

  /**
   * Creates an organization role.
   * @param organizationId Organization Id
   * @param data Role payload
   * @returns Organization role object
   */
  createTeamRole(
    organizationId: string,
    data: OrganizationTeamRoleCreateInput,
  ): Promise<OrganizationTeamRole> {
    return this.client.post('/organizations/' + organizationId + '/team/roles', {
      body: data,
    });
  }

  /**
   * Updates an organization role.
   * @param organizationId Organization Id
   * @param roleId Role Id
   * @param data Role payload
   * @returns Organization role object
   */
  updateTeamRole(
    organizationId: string,
    roleId: string,
    data: OrganizationTeamRoleUpdateInput,
  ): Promise<OrganizationTeamRole> {
    return this.client.put(
      '/organizations/' + organizationId + '/team/roles/' + roleId,
      {
        body: data,
      },
    );
  }

  /**
   * Deletes an organization role.
   * @param organizationId Organization Id
   * @param roleId Role Id
   * @returns Ok response
   */
  deleteTeamRole(
    organizationId: string,
    roleId: string,
  ): Promise<{ ok: boolean }> {
    return this.client.delete(
      '/organizations/' + organizationId + '/team/roles/' + roleId,
    );
  }
}
