class Webhooks {
    /**
     * @param {Wrapper} wrapper
     */
    constructor (wrapper) {
      this.wrapper = wrapper;
    }
  
    /**
     * Creates a new webhook in your organization
     * @param {Object} data
     * @returns {Promise}
     */
    create (data) {
      return this.wrapper.createWebhook(data);
    }
  
    /**
     * Gets a paginated list of webhooks that belong to your organization
     * @param {[Object]} params - Search parameters
     * @returns {Promise}
     */
    list (params) {
      return this.wrapper.listWebhooks(params);
    }
  
    /**
     * Gets a single webhook object
     * @param {string} id
     * @returns {Promise}
     */
    retrieve (id) {
      return this.wrapper.retrieveWebhook(id);
    }
  
    /**
     * Updates a webhook
     * @param {string} id
     * @param {Object} data
     * @returns {Promise}
     */
    update (id, data) {
      return this.wrapper.updateWebhook(id, data);
    }
  
    /**
     * Permanently removes a webhook from your organization.
     * @param {string} id
     * @returns {Promise}
     */
    del (id) {
      return this.wrapper.removeWebhook(id);
    }

  }
  
  module.exports = Webhooks;
  