var Wrapper = require('./lib/wrapper');
module.exports = function (apiKey) {
  var wrapper = new Wrapper(apiKey);
  return {
    customers: {
      list: wrapper.listCustomers,
      retrieve: wrapper.retrieveCustomer,
      create: wrapper.createCustomer,
      update: wrapper.updateCustomer,
      del: wrapper.removeCustomer
    },
    products: {
      list: wrapper.listProducts,
      retrieve: wrapper.retrieveProduct,
      create: wrapper.createProduct,
      update: wrapper.updateProduct,
      del: wrapper.removeProduct
    },
    invoices: {
      list: wrapper.listInvoices,
      retrieve: wrapper.retrieveInvoice,
      create: wrapper.createInvoice,
      cancel: wrapper.cancelInvoice
    }
  };
};
