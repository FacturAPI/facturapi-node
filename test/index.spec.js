const Facturapi = require('..');
const facturapi = new Facturapi('YOUR_API_KEY');

const run = async () => {
  const results = await facturapi.catalogs.searchUnits({ q: 'pulgada' });
  console.log(results.data);
};

run()
  .then(() => console.log('done'))
  .catch(console.error);
