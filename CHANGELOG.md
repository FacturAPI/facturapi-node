# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.6.0] 2025-02-25

### Added

- Allow creating edit links for customers, passing query params to create and edit customer methods.
- Edit link properties for customers.

## [4.5.0] 2025-01-07

### Added

- New fields for the Invoice object: `received_payment_ids` and `target_invoice_ids`,
  used to track payments and PPD invoices.

## [4.4.4] 2024-12-18

### Fixed

- Added try/catch to conditional import and define "stream" as external.

## [4.4.3] 2024-12-13

### Fixed

- Fix conditional import on web environments.

## [4.4.2] 2024-11-28

### Fixed

- Fix bug in Node.js environment in which the library was not returning the right kind of stream on download methods.

## [4.4.1] 2024-11-12

### Fixed

- Fix bug in which body params were not being sent in the request.

## [4.4.0] 2024-11-08

### Added

- Compatibility with browser environments and React Native. Now you can use Facturapi in the browser or in React Native, as long as you have a Fetch API compatible environment.
- Types for webhooks responses.
- Add `organizations.me` method to get the organization information.

### Fixed

- Name of validateSignature parameter "signature".

## [4.3.0] 2024-11-04

### Added

- Add types for all method responses. Method parameters are still not typed.

## [4.2.0] 2024-10-10

### Added

- List Live Api Keys: `listLiveApiKeys` for organizations
- Delete Live Api Keys: `deleteLiveApiKey` for organizations
- Validate webhooks responses: `validateSignature` for webhooks

## [4.1.2] 2024-07-15

### Added

- Fix optional `params` for invoice

## [4.1.1] 2024-06-15

### Fixed

- Fix `organization.createSeriesGroup` and `organization.updateSeriesGroup`. Thanks to @pastine

## [4.1.0] 2024-06-13

### Added

- Methods for CRUD of series
- Create method for series: `organization.createSeriesGroup`
- Read method for your organization series: `organization.listSeriesGroup`
- Update method for an specific series: `organization.updateSeriesGroup`
- Delete method for an specific series: `organization.deleteSeriesGroup`

## [4.0.0] 2024-05-23

### Breaking

- Remove deprecated method `products.keys` in favor of `catalogs.searchProducts`.
- Remove deprecated method `products.units` in favor of `catalogs.searchUnits`.
- Corrected the name of the method `invoices.editDraft` to `invoices.updateDraft`.
- The rest of the changes are internal and should not affect the public API.

### Added

- We rewrote the the library in TypeScript and now it's partially typed. Most request parameters and responses are not typed yet, but we plan to add more types in future releases.
- We export all type definitions, so you can use them in your TypeScript projects.
- New method to copy invoices to a new draft: `invoices.copyToDraft`.

## [3.6.0] 2024-05-23

### Added

- New method to delete certificates from the organization: `organizations.deleteCertificate`.
- New query param `async` in create invoice method:.
- New methods for draft invoices: `invoices.editDraft`, `invoices.stampDraft`.
- New method to update invoice status with the latest value from the SAT: `invoices.updateStatus`.

## [3.5.0] 2023-12-31

### Added

- Webhooks API

## [3.4.0] 2023-10-19

### Added

- Add `invoices.downloadCancellationReceiptPdf`.

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
