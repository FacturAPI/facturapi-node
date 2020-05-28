class Receipts {
  /**
   * @param {Wrapper} wrapper
   */
  constructor (wrapper) {
    this.wrapper = wrapper;
  }

  /**
   * Creates a new receipt
   * @param {Object} data
   * @returns {Promise}
   */
  create (data) {
    return this.wrapper.createReceipt(data);
  }

  /**
   * Gets a paginated list of receipts that belong to your organization
   * @param {[Object]} params Search parameters
   * @returns {Promise}
   */
  list (params) {
    return this.wrapper.listReceipts(params);
  }

  /**
   * Gets a single receipt object
   * @param {string} id
   * @returns {Promise}
   */
  retrieve (id) {
    return this.wrapper.retrieveReceipt(id);
  }

  /**
   * Creates an invoice for this receipt
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  invoice (id, data) {
    return this.wrapper.invoiceReceipt(id, data);
  }

  /**
   * Permanently removes a receipt from your organization.
   * @param {string} id
   * @returns {Promise}
   */
  cancel (id) {
    return this.wrapper.cancelReceipt(id);
  }
}

module.exports = Receipts;
