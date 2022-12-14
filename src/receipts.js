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
   * Creates a global invoice for open receipts
   * @param {Object} data
   * @returns {Promise}
   */
  createGlobalInvoice (data) {
    return this.wrapper.createGlobalInvoice(data);
  }

  /**
   * Marks a receipt as canceled. The receipt won't be available for invoicing anymore.
   * @param {string} id
   * @returns {Promise}
   */
  cancel (id) {
    return this.wrapper.cancelReceipt(id);
  }

  /**
   * Sends the receipt to the customer's email
   * @param {String} id Receipt Id
   * @param {any} data Additional arguments
   * @param {String} data.email Email address to send the receipt to
   * @returns {Promise}
   */
  sendByEmail (id, data) {
    return this.wrapper.sendReceiptByEmail(id, data);
  }

  /**
   * Downloads the specified receipt in PDF format
   * @param {string} id Receipt Id
   * @returns {Promise<ReadStream>} PDF file in a stream
   */
  downloadPdf (id) {
    return this.wrapper.downloadReceiptPdf(id);
  }
}

module.exports = Receipts;
