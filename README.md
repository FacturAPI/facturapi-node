# FacturAPI

[![npm version](https://badge.fury.io/js/facturapi.svg)](https://badge.fury.io/js/facturapi)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

This is the official HTTP client for https://www.facturapi.io

FacturAPI makes it easy for developers to generate valid Invoices in Mexico (known as Factura Electrónica or CFDI).

If you've ever used [Stripe](https://stripe.com) or [Conekta](https://conekta.io), you'll find FacturAPI very straightforward to understand and integrate in your server app.

## Compatibility

- Node.js 12.x or higher
- Browsers with Fetch API support
- React Native

## Install

```bash
npm install --save facturapi
```

## Getting started

### Authenticate with your API Key

Make sure you have created your free account on [FacturAPI](https://www.facturapi.io) and that you have your **API Keys**.

```javascript
// ES6
import Facturapi from 'facturapi';
// CommonJS
const Facturapi = require('facturapi').default;

const facturapi = new Facturapi('YOUR_API_KEY', {
  apiVersion: 'v2', // Optional, say what API version you want to use. Defaults to the latest version.
});
```

### Create a customer

```javascript
facturapi.customers
  .create({
    legal_name: 'Walter White', // Razón social
    tax_id: 'WIWA761018', // RFC
    email: 'walterwhite@gmail.com', // Optional but useful to send invoice by email
    address: {
      street: 'Av. de los Rosales',
      exterior: '123',
      neighborhood: 'Tepito',
      zip: '06800',
      // city, municipality and state are filled automatically from the zip code
      // but if you want to, you can override their values
      // city: 'México',
      // municipality: 'Cuauhtémoc',
      // state: 'Ciudad de México'
    },
  })
  .then((customer) => {
    // Remember to store the customer.id in your records.
    // You will need it to create an invoice for this customer.
  })
  .catch((err) => console.log(err)); // Handle the error.
```

### Create a product

```javascript
facturapi.products
  .create({
    product_key: '4319150114', // Clave Producto/Servicio from SAT's catalog. Log in to FacturAPI and use our tool to look it up.
    description: 'Apple iPhone 8',
    price: 20000, // price in MXN.
    // By default, taxes are calculated from the price with IVA 16%
    // But again, you can override that by explicitly providing a taxes array
    // taxes: [
    //   { type: Facturapi.TaxType.IVA, rate: 0.16 },
    //   { type: Facturapi.TaxType.ISR, rate: 0.03666, withholding: true }
    // ]
  })
  .then((product) => {
    // Remember to store the product.id in your records.
    // You will need it to create an invoice for this product.
  })
  .catch((err) => console.log(err)); // Handle the error.
```

### Create an invoice

```javascript
facturapi.invoices.create({
  customer: 'YOUR_CUSTOMER_ID',
  payment_form: Facturapi.PaymentForm.TRANSFERENCIA_ELECTRONICA, // Constant from SAT's catalog. Check out our documentation to learn more.
  items: [{
    quantity: 1, // Optional. Defaults to 1.
    product: 'YOUR_PRODUCT_ID' // You can also pass a product object instead
  }] // Add as many products as you want to include in your invoice
}).then(invoice => { ... });
```

#### Download your invoice

```javascript
// Once you have successfully created your invoice, you can...
const fs = require('fs');
facturapi.invoices.downloadZip(invoice.id) // or downloadPdf or downloadXml
  .then(zipStream => {
    // stream containing the PDF and XML as a ZIP file
    // Save your invoice to a folder
    const myZipFile = fs.createWriteStream('/path/to/destination/folder');
    zipStream.pipe(myZipFile);
    myZipFile.on('finish', () => {
      // Finished downloading, Yay!
    });
```

#### Send your invoice by email

```javascript
// Send the invoice to your customer's email (if any)
facturapi.invoices
  .sendByEmail(invioce.id) // Also returns a Promise
  .then(() => {
    // Successfully sent
  })
  .catch((err) => console.log(err)); // Handle the error.
```

## Documentation

There's more you can do with this library: List, retrieve, update, and remove Customers, Products and Invoices.

Visit the full documentation at http://docs.facturapi.io.

## Help

### Found a bug?

Please report it on the Issue Tracker

### Want to contribute?

Send us your PR! We appreciate your help :)

### Contact us!

contacto@facturapi.io
