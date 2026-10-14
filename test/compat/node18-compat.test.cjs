const test = require('node:test');
const assert = require('node:assert/strict');
const { Writable } = require('node:stream');
const crypto = require('node:crypto');

const Facturapi = require('facturapi');
assert.equal(typeof Facturapi, 'function');
assert.equal(Facturapi.default, Facturapi);

const ORIGINAL_FETCH = globalThis.fetch;

function createClient() {
  const client = new Facturapi('sk_test_123');
  client.BASE_URL = 'https://api.test.local/v2';
  return client;
}

function getHeader(headers, name) {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) || undefined;
  if (Array.isArray(headers)) {
    const match = headers.find(
      ([key]) => key.toLowerCase() === name.toLowerCase(),
    );
    return match && match[1];
  }
  return headers[name] || headers[name.toLowerCase()];
}

test.afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
});

test('node18: uses bearer auth and parses json', async () => {
  const client = createClient();

  globalThis.fetch = async (_url, options) => {
    assert.equal(
      getHeader(options.headers, 'Authorization'),
      'Bearer sk_test_123',
    );
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

test('node18: FIEL upload, receipt customer assignment, and API health use the built package', async () => {
  const client = createClient();
  const paths = [];
  globalThis.fetch = async (url, options) => {
    const path = new URL(String(url)).pathname;
    paths.push(path);
    if (path === '/v2/organizations/org_123/fiel') {
      assert.equal(options.method, 'PUT');
      assert.ok(options.body instanceof FormData);
      assert.equal(await options.body.get('cer').text(), 'certificate');
      assert.equal(await options.body.get('key').text(), 'private-key');
      assert.equal(options.body.get('password'), 'test-password');
      return Response.json({ id: 'org_123' });
    }
    if (path === '/v2/receipts/rec_123') {
      assert.equal(options.method, 'PUT');
      assert.deepEqual(JSON.parse(options.body), { customer: 'cus_123' });
      return Response.json({ id: 'rec_123' });
    }
    assert.equal(path, '/v2/check');
    assert.equal(options.method, 'GET');
    return Response.json({ ok: true });
  };
  assert.equal(
    (
      await client.organizations.uploadFiel(
        'org_123',
        Buffer.from('certificate'),
        Buffer.from('private-key'),
        'test-password',
      )
    ).id,
    'org_123',
  );
  assert.equal(
    (await client.receipts.updateCustomer('rec_123', { customer: 'cus_123' }))
      .id,
    'rec_123',
  );
  assert.deepEqual(await client.tools.checkApiHealth(), { ok: true });
  assert.deepEqual(paths, [
    '/v2/organizations/org_123/fiel',
    '/v2/receipts/rec_123',
    '/v2/check',
  ]);
});
