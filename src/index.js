const Wrapper = require('./wrapper');
const Customers = require('./customers');
const Products = require('./products');
const Invoices = require('./invoices');
const Organizations = require('./organizations');
const Catalogs = require('./catalogs');
const Receipts = require('./receipts');
const Retentions = require('./retentions');
const Webhooks = require('./webhooks')
const Tools = require('./tools');
const enums = require('./enums');
const { DEFAULT_API_VERSION } = require('./constants');

const VALID_API_VERSIONS = ['v1', 'v2'];

/**
 * Get an instance of the Facturapi library
 * @class
 * @param {string} apiKey Test or Live key.
 * @returns {Facturapi} Instance of this library
 */
class Facturapi {
  static get TaxType () {
    return enums.TaxType;
  }

  static get PaymentForm () {
    return enums.PaymentForm;
  }

  static get PaymentMethod () {
    return enums.PaymentMethod;
  }

  static get InvoiceType () {
    return enums.InvoiceType;
  }

  static get InvoiceUse () {
    return enums.InvoiceUse;
  }

  static get InvoiceRelation () {
    return enums.InvoiceRelation;
  }

  static get TaxSystem () {
    return enums.TaxSystem;
  }

  constructor (apiKey, options = {}) {
    if (options.apiVersion) {
      if (!VALID_API_VERSIONS.includes(options.apiVersion)) {
        throw new Error(
          'Invalid API version. Valid values are: ' +
            VALID_API_VERSIONS.join(', ')
        );
      }
      this.apiVersion = options.apiVersion;
    } else {
      this.apiVersion = DEFAULT_API_VERSION;
    }
    const wrapper = new Wrapper(apiKey, this.apiVersion);
    this.customers = new Customers(wrapper);
    this.products = new Products(wrapper);
    this.invoices = new Invoices(wrapper);
    this.organizations = new Organizations(wrapper);
    this.catalogs = new Catalogs(wrapper);
    this.receipts = new Receipts(wrapper);
    this.retentions = new Retentions(wrapper);
    this.tools = new Tools(wrapper);
    this.webhooks = new Webhooks(wrapper)
  }
}

module.exports = Facturapi;
