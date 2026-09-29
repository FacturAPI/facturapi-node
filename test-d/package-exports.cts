import Facturapi = require('facturapi')

const client = new Facturapi.default('sk_test_123')
const invoice: Promise<Facturapi.Invoice> = client.invoices.retrieve('inv_123')
void invoice
