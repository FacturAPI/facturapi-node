import test from 'node:test'
import assert from 'node:assert/strict'
import Facturapi, { FacturapiError, InvoiceType } from 'facturapi'

test('native ESM resolves the default constructor and named exports', () => {
  assert.equal(typeof Facturapi, 'function')
  assert.equal(new Facturapi('sk_test_123').apiVersion, 'v2')
  assert.equal(typeof FacturapiError, 'function')
  assert.equal(InvoiceType.INGRESO, 'I')
})
