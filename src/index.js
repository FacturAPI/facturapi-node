'use strict';

var Wrapper = require('./wrapper');
var Customers = require('./customers');
var Products = require('./products');
var Invoices = require('./invoices');
var enums = require('./enums');

/**
 * Get an instance of the Facturapi library
 * @class
 * @param {string} apiKey Test or Live key.
 * @returns {Facturapi} Instance of this library
 */
class Facturapi {
    constructor(apiKey) {
        const wrapper = new Wrapper(apiKey);
        this.customers = new Customers(wrapper);
        this.products = new Products(wrapper);
        this.invoices = new Invoices(wrapper);
        this.PaymentForm = enums.PaymentForm;
        this.PaymentFormList = enums.PaymentFormList;
        this.TaxType = enums.TaxType;
    }
}


module.exports = function (apiKey) {
    if (!(this instanceof Facturapi)) {
        return new Facturapi(apiKey);
    }
};
