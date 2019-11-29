class Catalogs {
  /**
   * @param {Wrapper} wrapper
   */
  constructor (wrapper) {
    this.wrapper = wrapper;
  }

  /**
   * Creates a new product in your organization
   * @param {Object} params - Search parameters
   * @returns {Promise}
   */
  searchProducts (params) {
    return this.wrapper.searchProducts(params);
  }

  /**
   * Gets a paginated list of products that belong to your organization
   * @param {[Object]} params - Search parameters
   * @returns {Promise}
   */
  searchUnits (params) {
    return this.wrapper.searchUnits(params);
  }
}

module.exports = Catalogs;
