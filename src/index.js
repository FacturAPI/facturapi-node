const Wrapper = require('./wrapper');
const Customers = require('./customers');
const Products = require('./products');
const Invoices = require('./invoices');
const Organizations = require('./organizations');
const Catalogs = require('./catalogs');
const Receipts = require('./receipts');
const enums = require('./enums');

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

  constructor (apiKey) {
    const wrapper = new Wrapper(apiKey);
    this.customers = new Customers(wrapper);
    this.products = new Products(wrapper);
    this.invoices = new Invoices(wrapper);
    this.organizations = new Organizations(wrapper);
    this.catalogs = new Catalogs(wrapper);
    this.receipts = new Receipts(wrapper);
  }
}

module.exports = Facturapi;
