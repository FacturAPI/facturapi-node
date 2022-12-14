# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.3.0] 2022-12-14

### Added

- Add `invoices.downloadCancellationReceiptXml`, `receipts.sendByEmail` and `receipts.downloadPdf`.

## [3.2.0] 2022-01-17

Note: Although this update includes a breaking change, only the minor version will be bumped, since we haven't officially announced the new API version yet.

### Breaking

- Remove `organizations.getApiKeys`.

### Added

- Add `organizations.getTestApiKey`, `organizations.renewTestApiKey` and `organizations.renewLiveApiKey`.

## [3.1.0] 2022-01-17

### Added

- Allow setting the API version in the client constructor.

## [3.0.0] 2022-01-16

### Breaking

- Change API version to point to /v2, in order to support CFDI 4.0

## [2.7.0] 2021-12-27

### Added

- Support sending params to `invoices.cancel` method.

## [2.6.1] 2021-09-05

### Fixed

- Stop logging request config

## [2.6.0] 2021-08-06

### Added

- New endpoint: `tools.validateTaxId`.

## [2.5.0] 2021-04-13

### Added

- Support for Retentions API

### Security

- Updated dependencies to address potential vulnerabilities.

## [2.4.0] 2020-12-24 🎄

### Added

- New method on receipts API: `createGlobalInvoice`

## [2.3.1] 2020-05-28

### Fixed

- `facturapi.organizations.uploadCertificate` only accepted `FileStream`s. Now it supports any kind of readable `Stream`, as well as `Buffer`.

## [2.3.0] 2020-05-28

### Added

- Support for receipts API
- Edit organization's receipts settings
- Check domain availability
- Select organization's domain

## [2.2.3] 2020-03-05

### Fixed

- Use correct endpoint for `catalogs.searchProducts`

## [2.2.2] 2019-11-29

### Added

- Catalogs API
  - Search product keys using `catalogs.searchProducts`.
  - Search unit keys using `catalogs.searchUnits`.

### Fixed

- Updated all dependencies to clear security warnings
- Previously swallowing messages from non-axios errors

### Deprecated

- `product.keys` and `product.units` are deprecated in favor of the new catalogs API, and will be removed on the next major release.

## [2.0.0] 2018-08-04

### Breaking changes

- Now you must create the Facturapi instance using the `new` keyword every time.

**Before:**

```javascript
// This was allowed
const facturapi = Facturapi('YOUR_API_KEY');
```

**Now:**

```javascript
// Now you must always use new
const facturapi = new Facturapi('YOUR_API_KEY');
```

## [1.2.0] 2018-08-04

### Fixed

- Reject with an Error, not with an object

## [1.1.0] 2018-05-06

### Added

- Support Organizations API

## [1.0.0] - 2018-05-01

### Added

- Search `product_key`s using `facturapi.products.keys('your search')`
- Search `unit_key`s using `facturapi.products.units('your search')`
- Constants for PaymentMethod, InvoiceType, InvoiceUse, InvoiceRelation

### Breaking changes

- Now contants should be accessed as static properties from the Facturapi class, instead of from the instance.

**Before:**

```javascript
const facturapi = new Facturapi('YOUR_API_KEY');
console.log(facturapi.TaxType.IVA); // > IVA
```

**Now:**

```javascript
console.log(Facturapi.TaxType.IVA); // > IVA
```

## [0.1.3] - 2017-06-20

### Fixed

- Protocol should be HTTPS

## [0.1.2] - 2017-06-20

### Added

- First release
- Wrapper methods for:
  - Customers
  - Products
  - Invoices
- Added README file
