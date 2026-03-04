import { WrapperClient } from '../wrapper';

export default class ComercioExteriorCatalogs {
  client: WrapperClient;

  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Search tariff fractions for Comercio Exterior
   * @param {Object} params - Search parameters (q, page, limit)
   * @returns {Promise}
   */
  searchTariffFractions(params: { q: string; page?: number; limit?: number }) {
    return this.client.get('/catalogs/comercioexterior/2.0/tariff-fractions', {
      params,
    });
  }
}
