import Facturapi from '..';

const facturapi = new Facturapi('YOUR_API_KEY_HERE');

const createInvoice = async () => {
  await facturapi.invoices.create(
    {
      status: Facturapi.InvoiceStatus.DRAFT,
      use: Facturapi.InvoiceUse.GASTOS_EN_GENERAL,
      payment_form: Facturapi.PaymentForm.TRANSFERENCIA_ELECTRONICA_DE_FONDOS,
      customer: {
        legal_name: 'John Doe',
        tax_id: 'XAXX010101000',
        tax_system: Facturapi.TaxSystem.GENERAL_LEY_DE_PERSONAS_MORALES,
        email: 'john@example.com',
        address: {
          zip: '83240',
        },
      },
      items: [
        {
          quantity: 3,
          product: {
            description: 'Noche de hotel, renta de habitación doble',
            price: 1234.56789,
            product_key: '90111800',
            unit_key: 'DAY',
          },
        },
      ],
    },
    { async: false },
  );
  const draftInvoice = await facturapi.invoices.create({
    status: Facturapi.InvoiceStatus.PENDING,
    use: Facturapi.InvoiceUse.GASTOS_EN_GENERAL,
    payment_form: Facturapi.PaymentForm.TRANSFERENCIA_ELECTRONICA_DE_FONDOS,
    customer: 'sdfa',
    items: [
      {
        discount: 0,
        quantity: 3,
        product: {
          description: 'Noche de hotel, renta de habitación doble',
          price: 1234.56789,
          product_key: '90111800',
          unit_key: 'DAY',
        },
      },
    ],
  });
  const list = await facturapi.invoices.list();
};

createInvoice()
  .then(() => console.log('invoice done'))
  .catch(console.error);
