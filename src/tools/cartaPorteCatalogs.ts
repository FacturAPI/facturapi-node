import { WrapperClient } from '../wrapper';

export default class CartaPorteCatalogs {
  client: WrapperClient;

  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Air transport codes (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchAirTransportCodes(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/air-transport-codes', {
      params,
    });
  }

  /**
   * Auto transport configurations (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchTransportConfigs(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/transport-configs', {
      params,
    });
  }

  /**
   * Rights of passage (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchRightsOfPassage(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/rights-of-passage', {
      params,
    });
  }

  /**
   * Customs documents (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchCustomsDocuments(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/customs-documents', {
      params,
    });
  }

  /**
   * Packaging types (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchPackagingTypes(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/packaging-types', {
      params,
    });
  }

  /**
   * Trailer types (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchTrailerTypes(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/trailer-types', {
      params,
    });
  }

  /**
   * Hazardous materials (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchHazardousMaterials(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/hazardous-materials', {
      params,
    });
  }

  /**
   * Naval authorizations (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchNavalAuthorizations(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/naval-authorizations', {
      params,
    });
  }

  /**
   * Port stations (air/sea/land) (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchPortStations(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/port-stations', {
      params,
    });
  }

  /**
   * Marine containers (Carta Porte 3.1)
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchMarineContainers(params: Record<string, any> | null) {
    return this.client.get('/catalogs/cartaporte/3.1/marine-containers', {
      params,
    });
  }
}
