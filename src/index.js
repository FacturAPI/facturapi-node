var Wrapper = require("./wrapper");
var Customers = require("./customers");
var Products = require("./products");
var Invoices = require("./invoices");
var Organizations = require("./organizations");
var enums = require("./enums");

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
  }
}

module.exports = function (apiKey) {
  if (!(this instanceof Facturapi)) {
    return new Facturapi(apiKey);
  }
};
