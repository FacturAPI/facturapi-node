import { AxiosInstance } from "axios";

export default class Tools {
  client: AxiosInstance
  /**
   * @param {Client} client
   */
  constructor (client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Validates a tax_id in EFOS list
   * @param {Object} taxId - Search parameters
   * @returns {Promise}
   */
  validateTaxId (taxId: string) {
    return this.client.get('/tools/tax_id_validation', {
      params: {
        tax_id: taxId
      }
    }).then(response => response.data);
  }
}
