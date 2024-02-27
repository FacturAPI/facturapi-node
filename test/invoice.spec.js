const Facturapi = require('..');
const facturapi = new Facturapi(
  'YOUR_API_KEY_HERE'
);

const createInvoice = async () => {
 await facturapi.invoices.create(
    {
      payment_form: '08',
      use: 'S01',
      customer: {
        legal_name: 'John Doe',
        tax_id: 'XAXX010101000',
        tax_system: '601',
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
    { async: false }
  );
};

createInvoice()
  .then(() => console.log('invoice done'))
  .catch(console.error);

