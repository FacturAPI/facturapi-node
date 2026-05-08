import Facturapi, {
  buildIeduComplement,
  IEDU_NAMESPACE,
  IeduComplementInput,
} from '..';

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

// IEDU complement type-check example (consumed by tsd):
const ieduInput: IeduComplementInput = {
  nombreAlumno: 'JUAN PEREZ GARCIA',
  CURP: 'PEGJ100515HDFRRN09',
  nivelEducativo: 'Primaria',
  autRVOE: 'ABC-123456',
  rfcPago: 'PEGM800101AB1',
};

const createTuitionInvoice = async () => {
  await facturapi.invoices.create({
    customer: 'YOUR_CUSTOMER_ID',
    use: Facturapi.InvoiceUse.SERVICIOS_EDUCATIVOS,
    payment_form: Facturapi.PaymentForm.TRANSFERENCIA_ELECTRONICA_DE_FONDOS,
    items: [
      {
        quantity: 1,
        product: {
          description: 'Colegiatura Mayo 2026 - Primaria',
          product_key: '86121503',
          unit_key: 'E48',
          price: 5000,
        },
        complement: buildIeduComplement(ieduInput),
      },
    ],
    namespaces: [IEDU_NAMESPACE],
  });
};

createTuitionInvoice().catch(console.error);
