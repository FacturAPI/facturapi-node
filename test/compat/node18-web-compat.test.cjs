const test = require('node:test');
const assert = require('node:assert/strict');

const FacturapiModule = require('../../dist/index.cjs.js');
const Facturapi = FacturapiModule.default || FacturapiModule;

const ORIGINAL_FETCH = globalThis.fetch;
const ORIGINAL_BUFFER = globalThis.Buffer;

function createClient() {
  const client = new Facturapi('sk_test_123');
  client.BASE_URL = 'https://api.test.local/v2';
  return client;
}

test.afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  globalThis.Buffer = ORIGINAL_BUFFER;
});

test('node18-web: sends bearer auth and parses json', async () => {
  const client = createClient();

  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer sk_test_123');
    return {
      ok: true,
      headers: {
        get(name) {
          return name.toLowerCase() === 'content-type'
            ? 'application/json'
            : null;
        },
      },
      async json() {
        return { id: 'inv_123' };
      },
      async text() {
        return '';
      },
    };
  };

  const invoice = await client.invoices.retrieve('inv_123');
  assert.equal(invoice.id, 'inv_123');
});

test('node18-web: binary downloads return Blob when Buffer is unavailable', async () => {
  const client = createClient();
  globalThis.Buffer = undefined;

  globalThis.fetch = async () => {
    return {
      ok: true,
      headers: {
        get(name) {
          return name.toLowerCase() === 'content-type'
            ? 'application/zip'
            : null;
        },
      },
      body: undefined,
      async blob() {
        return new Blob(['zip-binary-content']);
      },
      async json() {
        return {};
      },
      async text() {
        return '';
      },
    };
  };

  const zip = await client.invoices.downloadZip('inv_123');
  assert.equal(zip instanceof Blob, true);
  assert.equal(await zip.text(), 'zip-binary-content');
});

test('node18-web: uploads send multipart FormData without forcing content-type', async () => {
  const client = createClient();

  globalThis.fetch = async (_url, options) => {
    assert.equal(options.method, 'PUT');
    assert.equal(options.body instanceof FormData, true);
    assert.equal(Object.prototype.hasOwnProperty.call(options.headers, 'Content-Type'), false);
    assert.equal(options.headers.Authorization, 'Bearer sk_test_123');

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

test('node18-web: validates webhook signatures via webcrypto branch', async () => {
  const client = createClient();
  globalThis.Buffer = undefined;

  const payload = '{"id":"evt_web_123","type":"invoice.created"}';
  const secret = 'whsec_web_fixed';
  const precomputedSignature =
    'adffbea89398760c226a664f8e14d9e66b5105b84dabe8a2868638c650b05721';

  const event = await client.webhooks.validateSignature({
    secret,
    signature: precomputedSignature,
    payload,
  });

  assert.equal(event.id, 'evt_web_123');
  assert.equal(event.type, 'invoice.created');

  await assert.rejects(
    client.webhooks.validateSignature({
      secret,
      signature: 'deadbeef',
      payload,
    }),
    /Invalid signature/,
  );
});
