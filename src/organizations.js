class Organizations {
  /**
   * @param {Wrapper} wrapper
   */
  constructor (wrapper) {
    this.wrapper = wrapper;
  }

  /**
   * Creates a new organization for your account
   * @param {Object} data
   * @returns {Promise}
   */
  create (data) {
    return this.wrapper.createOrganization(data);
  }

  /**
   * Gets a paginated list of organizations that belong to your account
   * @param {[Object]} params - Search parameters
   * @returns {Promise}
   */
  list (params) {
    return this.wrapper.listOrganizations(params);
  }

  /**
   * Gets a single organization object
   * @param {string} id
   * @returns {Promise}
   */
  retrieve (id) {
    return this.wrapper.retrieveOrganization(id);
  }

  /**
   * Updates the organization's legal information
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  updateLegal (id, data) {
    return this.wrapper.updateOrganizationLegal(id, data);
  }

  /**
   * Updates the organization's customization information
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  updateCustomization (id, data) {
    return this.wrapper.updateOrganizationCustomization(id, data);
  }

  /**
   * Updates the organization's customization information
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  updateReceiptSettings (id, data) {
    return this.wrapper.updateReceiptSettings(id, data);
  }

  /**
   * Updates the organization's customization information
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  updateDomain (id, data) {
    return this.wrapper.updateDomain(id, data);
  }

  /**
   * Checks if a domain is available for self invoices
   * @param {object} data
   * @returns {Promise<{ available: boolean }>}
   */
  checkDomainIsAvailable (data) {
    return this.wrapper.checkDomainIsAvailable(data);
  }

  /**
   * Uploads the organization's logo
   * @param {string} id
   * @param {ReadableStream} file
   * @returns {Promise}
   */
  uploadLogo (id, file) {
    return this.wrapper.uploadOrganizationLogo(id, file);
  }

  /**
   * Uploads the organization's certificate (CSD)
   * @param {string} id
   * @param {ReadableStream} cerFile
   * @param {ReadableStream} keyFile
   * @param {string} password
   * @returns {Promise}
   */
  uploadCertificate (id, cerFile, keyFile, password) {
    return this.wrapper.uploadOrganizationCertificate(
      id,
      cerFile,
      keyFile,
      password
    );
  }

  /**
   * Permanently removes a organization from your account.
   * @param {string} id
   * @returns {Promise<void>}
   */
  del (id) {
    return this.wrapper.removeOrganization(id);
  }

  /**
   * Gets the test api key for an organization
   * @param {string} id
   * @returns {Promise<string>}
   */
  getTestApiKey (id) {
    return this.wrapper.getTestApiKey(id);
  }

  /**
   * Renews the test api key and makes the previous one unusable
   * @param {string} id
   * @returns {Promise<string>}
   */
  renewTestApiKey (id) {
    return this.wrapper.renewTestApiKey(id);
  }

  /**
   * Renews the live api key and makes the previous one unusable
   * @param {string} id
   * @returns {Promise<string>}
   */
  renewLiveApiKey (id) {
    return this.wrapper.renewLiveApiKey(id);
  }
}

module.exports = Organizations;
