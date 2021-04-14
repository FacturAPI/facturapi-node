class Retentions {
  /**
   * @param {Wrapper} wrapper
   */
  constructor (wrapper) {
    this.wrapper = wrapper;
  }

  /**
   * Creates a new valid retention (CFDI).
   * @param {Object} data
   * @returns {Promise}
   */
  create (data) {
    return this.wrapper.createRetention(data);
  }

  /**
   * Gets a paginated list of retentions created by the organization
   * @param {[Object]} params - Search parameters
   * @returns {Promise}
   */
  list (params) {
    return this.wrapper.listRetentions(params);
  }

  /**
   * Gets a single retention object
   * @param {string} id
   * @returns {Promise}
   */
  retrieve (id) {
    return this.wrapper.retrieveRetention(id);
  }

  /**
   * Cancels a retention.
   * @param {string} id
   * @returns {Promise}
   */
  cancel (id) {
    return this.wrapper.cancelRetention(id);
  }

  /**
   * Sends a retention to the customer's email
   * @param {String} id Retention Id
   * @param {Object} data Additional arguments
   * @param {String} data.email Email address to send the retention to
   * @returns {Promise}
   */
  sendByEmail (id, data) {
    return this.wrapper.sendRetentionByEmail(id, data);
  }

  /**
   * Downloads the specified retention in PDF format
   * @param {string} id Retention Id
   * @returns {Promise<ReadStream>} PDF file in a stream
   */
  downloadPdf (id) {
    return this.wrapper.downloadRetentionPdf(id);
  }

  /**
   * Downloads the specified retention in XML format
   * @param {string} id Retention Id
   * @returns {Promise<ReadStream>} XML file in a stream
   */
  downloadXml (id) {
    return this.wrapper.downloadRetentionXml(id);
  }

  /**
   * Downloads the specified retention in a ZIP package containing both PDF and XML files
   * @param {string} id Retention Id
   * @returns {Promise<ReadStream>} ZIP file in a stream
   */
  downloadZip (id) {
    return this.wrapper.downloadRetentionZip(id);
  }
}

module.exports = Retentions;
