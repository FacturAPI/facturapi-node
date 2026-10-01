import Facturapi = require('..')

const client = new Facturapi('sk_test_123')
const invoice: Promise<Facturapi.Invoice> = client.invoices.retrieve('inv_123')
void invoice
const invoiceType: Facturapi.InvoiceType = Facturapi.InvoiceType.INGRESO
const invoices: Promise<Facturapi.SearchResult<Facturapi.Invoice>> =
  client.invoices.list()
void [invoiceType, invoices]

const legacy = new Facturapi.default('sk_test_123')
void legacy
