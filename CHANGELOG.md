# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.0.0]

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