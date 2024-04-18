const Facturapi = require('..');
const facturapi = new Facturapi(
  'YOUR_API_KEY_HERE'
);
const fs = require('fs')

const createInvoice = async () => {
    const cerFileStream = fs.createReadStream('fake_csd.cer');
    const keyFileStream = fs.createReadStream('fake_csd.key');
    

 await facturapi.organizations.uploadCertificate(
    'RANDOM_ORG_ID_HERE',
    cerFileStream,
    keyFileStream,
    '12345678a'
  );
};

createInvoice()
  .then(() => console.log('certs done'))
  .catch(console.error);

