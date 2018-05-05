class Customers {
  /**
   * @param {Wrapper} wrapper
   */
  constructor (wrapper) {
    this.wrapper = wrapper;
  }
  /**
   * Creates a new customer in your organization
   * @param {Object} data
   * @returns {Promise}
   */
  create (data) {
    return this.wrapper.createCustomer(data);
  }
  /**
   * Gets a paginated list of customers that belong to your organization
   * @param {[Object]} params - Search parameters
   * @returns {Promise}
   */
  list (params) {
    return this.wrapper.listCustomers(params);
  }
  /**
   * Gets a single customer object
   * @param {string} id
   * @returns {Promise}
   */
  retrieve (id) {
    return this.wrapper.retrieveCustomer(id);
  }
  /**
   * Updates a customer
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update (id, data) {
    return this.wrapper.updateCustomer(id, data);
  }
  /**
   * Permanently removes a customer from your organization.
   * @param {string} id
   * @returns {Promise}
   */
  del (id) {
    return this.wrapper.removeCustomer(id);
  }
}

module.exports = Customers;
