import Facturapi, { PaymentForm, type InvoiceCreateInput } from 'facturapi'

const facturapi = new Facturapi('sk_test_solo_editor')

export const ingreso = {
  customer: 'cus_ejemplo',
  payment_form: PaymentForm.TARJETA_DE_DEBITO,
  items: [
    {
      quantity: 1,
      product: { description: 'Ejemplo', product_key: '60131324', price: 100 },
    },
  ],
} satisfies InvoiceCreateInput

export const pago = {
  type: 'P',
  customer: 'cus_ejemplo',
  complements: [
    {
      type: 'pago',
      data: {
        payment_form: '28',
        related_documents: [
          {
            uuid: '39c85a3f-275b-4341-b259-e8971d9f8a94',
            amount: 100,
            installment: 1,
            last_balance: 100,
            taxes: [],
          },
        ],
      },
    },
  ],
} satisfies InvoiceCreateInput

// Estas funciones sirven para explorar IntelliSense; no se llaman al abrir el archivo.
export async function explorarRespuestas() {
  const factura = await facturapi.invoices.create(ingreso)
  const resultados = await facturapi.invoices.list({
    pagination: 'cursor',
    limit: 10,
  })
  return {
    fecha: factura.date?.toISOString(),
    fechaTimbrado: factura.stamp?.date,
    facturas: resultados.data,
  }
}

export async function explorarDryRun() {
  const resumen = await facturapi.receipts.toInvoice({
    keys: ['rec_ejemplo'],
    dry_run: true,
  })
  const factura = await facturapi.receipts.toInvoice({ keys: ['rec_ejemplo'] })
  return { resumen, factura }
}

export function explorarDescargas() {
  return facturapi.invoices.downloadPdf('inv_ejemplo')
}

// Explora los tipos de respuesta o cambia los campos de entrada.
export async function explorarUrls() {
  const download = await facturapi.invoices.downloadPdfUrl('inv_ejemplo')
  return {
    url: download.url,
    expiresAt: download.expires_at.toISOString(),
    filename: download.filename,
    contentType: download.content_type,
  }
}

export async function explorarResumenDePago() {
  const summary = await facturapi.invoices.paymentSummary('inv_ejemplo', {
    amount: 100,
  })
  return facturapi.invoices.create({
    type: 'P',
    customer: 'cus_ejemplo',
    complements: [
      {
        type: 'pago',
        data: { payment_form: '28', related_documents: [summary] },
      },
    ],
  })
}
