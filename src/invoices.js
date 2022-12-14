class Invoices {
  /**
   * @param {Wrapper} wrapper
   */
  constructor (wrapper) {
    this.wrapper = wrapper;
  }

  /**
   * Creates a new valid invoice (CFDI).
   * @param {Object} data
   * @returns {Promise}
   */
  create (data) {
    return this.wrapper.createInvoice(data);
  }

  /**
   * Gets a paginated list of invoices created by your organization
   * @param {[Object]} params - Search parameters
   * @returns {Promise}
   */
  list (params) {
    return this.wrapper.listInvoices(params);
  }

  /**
   * Gets a single invoice object
   * @param {string} id
   * @returns {Promise}
   */
  retrieve (id) {
    return this.wrapper.retrieveInvoice(id);
  }

  /**
   * Cancels an invoice. The invoice will not be valid anymore and will change its status to canceled.
   * @param {string} id
   * @param {any} params
   * @returns {Promise}
   */
  cancel (id, params) {
    return this.wrapper.cancelInvoice(id, params);
  }

  /**
   * Sends the invoice to the customer's email
   * @param {String} id Invoice Id
   * @param {any} data Additional arguments
   * @param {String} data.email Email address to send the invoice to
   * @returns {Promise}
   */
  sendByEmail (id, data) {
    return this.wrapper.sendInvoiceByEmail(id, data);
  }

  /**
   * Downloads the specified invoice in PDF format
   * @param {string} id Invoice Id
   * @returns {Promise<ReadStream>} PDF file in a stream
   */
  downloadPdf (id) {
    return this.wrapper.downloadPdf(id);
  }

  /**
   * Downloads the specified invoice in XML format
   * @param {string} id Invoice Id
   * @returns {Promise<ReadStream>} XML file in a stream
   */
  downloadXml (id) {
    return this.wrapper.downloadXml(id);
  }

  /**
   * Downloads the specified invoice in a ZIP package containing both PDF and XML files
   * @param {string} id Invoice Id
   * @returns {Promise<ReadStream>} ZIP file in a stream
   */
  downloadZip (id) {
    return this.wrapper.downloadZip(id);
  }

  /**
   * Downloads the cancellation receipt of a canceled invoice in XML format
   * @param {string} id Invoice Id
   * @returns {Promise<ReadStream>} XML file in a stream
   */
  downloadCancellationReceiptXml (id) {
    return this.wrapper.downloadCancellationReceiptXml(id);
  }
}

module.exports = Invoices;
