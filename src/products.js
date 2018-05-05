class Products {
  /**
   * @param {Wrapper} wrapper
   */
  constructor (wrapper) {
    this.wrapper = wrapper;
  }

  /**
   * Creates a new product in your organization
   * @param {Object} data
   * @returns {Promise}
   */
  create (data) {
    return this.wrapper.createProduct(data);
  }

  /**
   * Gets a paginated list of products that belong to your organization
   * @param {[Object]} params - Search parameters
   * @returns {Promise}
   */
  list (params) {
    return this.wrapper.listProducts(params);
  }

  /**
   * Gets a single product object
   * @param {string} id
   * @returns {Promise}
   */
  retrieve (id) {
    return this.wrapper.retrieveProduct(id);
  }

  /**
   * Updates a product
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update (id, data) {
    return this.wrapper.updateProduct(id, data);
  }

  /**
   * Permanently removes a product from your organization.
   * @param {string} id
   * @returns {Promise}
   */
  del (id) {
    return this.wrapper.removeProduct(id);
  }

  /**
   * Searches product keys by criteria
   * @param {string} criteria
   * @returns {Promise}
   */
  keys (criteria) {
    return this.wrapper.keys(criteria);
  }

  /**
   * Searches products units by criteria
   * @param {string} criteria
   * @returns {Promise}
   */
  units (criteria) {
    return this.wrapper.units(criteria);
  }
}

module.exports = Products;
