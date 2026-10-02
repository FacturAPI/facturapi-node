import Facturapi, { type Invoice } from 'facturapi'

const client = new Facturapi('sk_test_123')
const invoice: Promise<Invoice> = client.invoices.retrieve('inv_123')
void invoice
