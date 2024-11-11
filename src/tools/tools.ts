import { WrapperClient } from '../wrapper';

export default class Tools {
  client: WrapperClient;
  /**
   * @param {Client} client
   */
  constructor(client: WrapperClient) {
    this.client = client;
  }

  /**
   * Validates a tax_id in EFOS list
   * @param {Object} taxId - Search parameters
   * @returns {Promise}
   */
  validateTaxId(taxId: string) {
    return this.client.get('/tools/tax_id_validation', {
      params: {
        tax_id: taxId,
      },
    });
  }
}
