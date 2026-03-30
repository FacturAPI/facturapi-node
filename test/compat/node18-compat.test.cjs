const test = require('node:test');
const assert = require('node:assert/strict');
const { Writable } = require('node:stream');
const crypto = require('node:crypto');

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

test('node18: validates webhook signatures locally with node crypto', async () => {
  const client = createClient();
  const payload = '{"id":"evt_123","type":"invoice.created"}';
  const secret = 'whsec_test_fixed';
  const precomputedSignature =
    'cebe006de72ff7836e0a39b2dcb7c6304f27039441ae21b52fba413f24516d6e';

  const event = await client.webhooks.validateSignature({
    secret,
    signature: precomputedSignature,
    payload,
  });

  assert.equal(event.id, 'evt_123');
  assert.equal(event.type, 'invoice.created');

  await assert.rejects(
    client.webhooks.validateSignature({
      secret,
      signature: crypto
        .createHmac('sha256', 'different_secret')
        .update(payload)
        .digest('hex'),
      payload,
    }),
    /Invalid signature/,
  );
});
