class Tools {
  /**
   * @param {Wrapper} wrapper
   */
  constructor (wrapper) {
    this.wrapper = wrapper;
  }

  /**
   * Validates a tax_id
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  validateTaxId (taxId) {
    return this.wrapper.validateTaxId(taxId);
  }
}

module.exports = Tools;
