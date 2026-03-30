const test = require('node:test');
const assert = require('node:assert/strict');
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

test('parses JSON responses and sends auth header', async () => {
  const client = createClient();

  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.test.local/v2/invoices/inv_123');
    assert.equal(options.method, 'GET');
    assert.match(options.headers.Authorization, /^Basic\s+/);
    assert.equal(options.headers['Content-Type'], 'application/json');

    return new Response(JSON.stringify({ id: 'inv_123', object: 'invoice' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  const invoice = await client.invoices.retrieve('inv_123');
  assert.equal(invoice.id, 'inv_123');
});

test('returns a pipeable stream-like object for binary downloads in Node', async () => {
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
  await new Promise((resolve, reject) => {
    zip.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    zip.on('error', reject);
    zip.on('end', resolve);
  });

  assert.equal(Buffer.concat(chunks).toString('utf8'), 'zip-binary-content');
});

test('sends multipart FormData for upload endpoints', async () => {
  const client = createClient();

  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.test.local/v2/organizations/org_123/logo');
    assert.equal(options.method, 'PUT');
    assert.ok(options.body instanceof FormData);
    assert.equal('Content-Type' in options.headers, false);
    assert.match(options.headers.Authorization, /^Basic\s+/);

    return new Response(JSON.stringify({ id: 'org_123', object: 'organization' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  const organization = await client.organizations.uploadLogo(
    'org_123',
    new Uint8Array([1, 2, 3]),
  );

  assert.equal(organization.id, 'org_123');
});

test('validates webhook signatures locally in Node', async () => {
  const client = createClient();
  const payloadObject = { id: 'evt_123', type: 'invoice.created' };
  const payload = JSON.stringify(payloadObject);
  const secret = 'whsec_test';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const event = await client.webhooks.validateSignature({
    secret,
    signature,
    payload,
  });

  assert.equal(event.id, payloadObject.id);
  assert.equal(event.type, payloadObject.type);

  await assert.rejects(
    client.webhooks.validateSignature({
      secret,
      signature: '00',
      payload,
    }),
    /Invalid signature/,
  );
});
