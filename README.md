# FacturAPI

[![npm version](https://badge.fury.io/js/facturapi.svg)](https://badge.fury.io/js/facturapi)
[![CI](https://github.com/FacturAPI/facturapi-node/actions/workflows/ci.yml/badge.svg)](https://github.com/FacturAPI/facturapi-node/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)

Official HTTP client for [FacturAPI](https://www.facturapi.io).

FacturAPI helps developers generate valid electronic invoices (CFDI) in Mexico.

If you've used [Stripe](https://stripe.com) or [Conekta](https://conekta.io), you'll find the API style familiar.

## Compatibility

| Runtime | Support |
| --- | --- |
| Node.js | `>=18` (CI tested on 18, 20, 22, 24) |
| Browser | Environments with `fetch`, `FormData`, and `Blob` |
| React Native | Versions that provide global `fetch`, `FormData`, and `Blob` |

## Install

```bash
npm i facturapi
```

## TypeScript

This SDK is TypeScript-first and exports its public types.

## Getting started

Make sure you have a FacturAPI account and your API key.

```ts
import Facturapi from 'facturapi';

const facturapi = new Facturapi(process.env.FACTURAPI_KEY!);
```

CommonJS:

```javascript
const Facturapi = require('facturapi').default;
```

### Create a customer

```ts
const customer = await facturapi.customers.create({
  legal_name: 'Walter White',
  tax_id: 'WIWA761018',
  email: 'walterwhite@gmail.com',
  address: {
    zip: '06800',
    country: 'MEX',
  },
});
```

### Create an invoice

```ts
const invoice = await facturapi.invoices.create({
  customer: 'YOUR_CUSTOMER_ID',
  payment_form: Facturapi.PaymentForm.TRANSFERENCIA_ELECTRONICA_DE_FONDOS,
  items: [
    {
      quantity: 1,
      product: 'YOUR_PRODUCT_ID',
    },
  ],
});
```

#### Download your invoice

`downloadZip`, `downloadPdf` and `downloadXml` return a binary result:
- Node.js: stream-like object
- Browser: `Blob`

```ts
import fs from 'fs';

const file = await facturapi.invoices.downloadZip(invoice.id);

// Node-first style (explicit cast)
const stream = file as NodeJS.ReadableStream;
stream.pipe(fs.createWriteStream('/tmp/invoice.zip'));
```

Portable style (Node + browser):

```ts
const file = await facturapi.invoices.downloadZip(invoice.id);
if ('pipe' in file && typeof file.pipe === 'function') {
  file.pipe(fs.createWriteStream('/tmp/invoice.zip'));
} else {
  const url = URL.createObjectURL(file);
  window.open(url, '_blank');
}
```

#### Send your invoice by email

```ts
await facturapi.invoices.sendByEmail(invoice.id, {
  email: 'customer@example.com',
});
```

### Educational services (IEDU complement)

Schools issuing CFDIs to parents for tuition (colegiaturas) include the IEDU complement so that parents can claim the [Decreto de Deducción de Colegiaturas](https://www.sat.gob.mx/minisitio/DeduccionesPersonales/colegiaturas.html) on their annual ISR return. The SDK exports a typed `IeduComplementInput`, a `buildIeduComplement()` helper that returns the SAT-required XML, and an `IEDU_NAMESPACE` constant to register on the invoice.

```ts
import Facturapi, { buildIeduComplement, IEDU_NAMESPACE } from 'facturapi';

const invoice = await facturapi.invoices.create({
  customer: 'YOUR_CUSTOMER_ID',
  use: Facturapi.InvoiceUse.SERVICIOS_EDUCATIVOS, // D10
  payment_form: Facturapi.PaymentForm.TRANSFERENCIA_ELECTRONICA_DE_FONDOS,
  items: [
    {
      quantity: 1,
      product: {
        description: 'Colegiatura Mayo 2026 - Primaria',
        product_key: '86121503',
        unit_key: 'E48',
        price: 5000,
        taxes: [],
      },
      complement: buildIeduComplement({
        nombreAlumno: 'JUAN PEREZ GARCIA',
        CURP: 'PEGJ100515HDFRRN09',
        nivelEducativo: 'Primaria',
        autRVOE: 'ABC-123456',
        rfcPago: 'PEGM800101AB1', // optional, only when payer ≠ receptor
      }),
    },
  ],
  namespaces: [IEDU_NAMESPACE],
});
```

`nivelEducativo` accepts: `Preescolar`, `Primaria`, `Secundaria`, `Profesional Técnico`, `Bachillerato o su equivalente` (university tuition is not deductible and therefore not part of IEDU).

## Documentation

Visit [docs.facturapi.io](https://docs.facturapi.io).

## Help

### Found a bug?

Please report it on the issue tracker.

### Want to contribute?

Send us your PR! We appreciate your help :)

### Contact us!

contacto@facturapi.io
