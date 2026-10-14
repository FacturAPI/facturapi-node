import { WrapperClient } from '../wrapper';

export default class NominaCatalogs {
  client: WrapperClient;

  constructor(client: WrapperClient) {
    this.client = client;
  }

  searchDeductions(params: { q: string; page?: number; limit?: number }) {
    return this.client.get('/catalogs/deductions', { params });
  }

  searchPerceptions(params: { q: string; page?: number; limit?: number }) {
    return this.client.get('/catalogs/perceptions', { params });
  }
}
