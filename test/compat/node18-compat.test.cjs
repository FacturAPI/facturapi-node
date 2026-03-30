const test = require('node:test');
const assert = require('node:assert/strict');
const { Writable } = require('node:stream');

const FacturapiModule = require('../../dist/index.cjs.js');
const Facturapi = FacturapiModule.default || FacturapiModule;

const ORIGINAL_FETCH = globalThis.fetch;

function createClient() {
  const client = new Facturapi('sk_test_123');
  client.BASE_URL = 'https://api.test.local/v2';
  return client;
}

test.afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
});

test('node18: uses bearer auth and parses json', async () => {
  const client = createClient();

  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer sk_test_123');
    return new Response(JSON.stringify({ id: 'inv_123' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  const invoice = await client.invoices.retrieve('inv_123');
  assert.equal(invoice.id, 'inv_123');
});

test('node18: binary downloads remain pipeable', async () => {
  const client = createClient();

  globalThis.fetch = async () => {
    return new Response(new Blob([Buffer.from('zip-binary-content')]), {
      status: 200,
      headers: { 'content-type': 'application/zip' },
    });
  };

  const zip = await client.invoices.downloadZip('inv_123');
  assert.equal(typeof zip.pipe, 'function');

  const chunks = [];
  const writable = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk));
      callback();
    },
  });

  await new Promise((resolve, reject) => {
    writable.on('finish', resolve);
    writable.on('error', reject);
    zip.on('error', reject);
    zip.pipe(writable);
  });

  assert.equal(Buffer.concat(chunks).toString('utf8'), 'zip-binary-content');
});
