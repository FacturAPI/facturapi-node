import crypto from 'node:crypto';
import { Writable } from 'node:stream';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Facturapi from '../../src';

const originalFetch = globalThis.fetch;

function createClient() {
  const client = new Facturapi('sk_test_123');
  client.BASE_URL = 'https://api.test.local/v2';
  return client;
}

function getHeader(
  headers: HeadersInit | undefined,
  name: string,
): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) || undefined;
  if (Array.isArray(headers)) {
    const match = headers.find(
      ([key]) => key.toLowerCase() === name.toLowerCase(),
    );
    return match?.[1];
  }
  const map = headers as Record<string, string>;
  return map[name] || map[name.toLowerCase()];
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('runtime compatibility (node)', () => {
  it('sends bearer auth header in Node', async () => {
    const client = createClient();
    const expected = 'Bearer sk_test_123';

    globalThis.fetch = vi.fn(async (_url, options) => {
      expect(getHeader(options?.headers, 'Authorization')).toBe(expected);
      return new Response(JSON.stringify({ id: 'inv_123' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as typeof fetch;

    await client.invoices.retrieve('inv_123');
  });

  it('parses JSON responses and sends auth header', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe('https://api.test.local/v2/invoices/inv_123');
      expect(options?.method).toBe('GET');
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Bearer sk_test_123',
      );
      expect(getHeader(options?.headers, 'Content-Type')).toBe(
        'application/json',
      );

      return new Response(
        JSON.stringify({
          id: 'inv_123',
          object: 'invoice',
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      );
    }) as typeof fetch;

    const invoice = await client.invoices.retrieve('inv_123');
    expect(invoice.id).toBe('inv_123');
  });

  it('surfaces API message from non-OK JSON responses', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          message: 'invoice not found',
        }),
        {
          status: 404,
          headers: { 'content-type': 'application/json' },
        },
      );
    }) as typeof fetch;

    await expect(client.invoices.retrieve('inv_123')).rejects.toThrow(
      'invoice not found',
    );
  });

  it('falls back to raw text when non-OK JSON body is malformed', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async () => {
      return new Response('not-a-json-body', {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }) as typeof fetch;

    await expect(client.invoices.retrieve('inv_123')).rejects.toThrow(
      'not-a-json-body',
    );
  });

  it('falls back to status text when non-OK body is empty', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async () => {
      return new Response('', {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'content-type': 'text/plain' },
      });
    }) as typeof fetch;

    await expect(client.invoices.retrieve('inv_123')).rejects.toThrow(
      'Bad Request',
    );
  });

  it('returns a pipeable stream-like object for binary downloads', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async () => {
      return new Response(new Blob([Buffer.from('zip-binary-content')]), {
        status: 200,
        headers: { 'content-type': 'application/zip' },
      });
    }) as typeof fetch;

    const zip = await client.invoices.downloadZip('inv_123');

    expect(zip instanceof Blob).toBe(false);
    expect(typeof (zip as any).pipe).toBe('function');

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      (zip as any).on('data', (chunk: unknown) => {
        chunks.push(Buffer.from(chunk as Uint8Array));
      });
      (zip as any).on('error', reject);
      (zip as any).on('end', resolve);
    });

    expect(Buffer.concat(chunks).toString('utf8')).toBe('zip-binary-content');
  });

  it('pipes binary downloads to a Node writable stream', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async () => {
      return new Response(new Blob([Buffer.from('zip-binary-content')]), {
        status: 200,
        headers: { 'content-type': 'application/zip' },
      });
    }) as typeof fetch;

    const zip = await client.invoices.downloadZip('inv_123');

    const written: Buffer[] = [];
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        written.push(Buffer.from(chunk));
        callback();
      },
    });

    await new Promise<void>((resolve, reject) => {
      writable.on('finish', resolve);
      writable.on('error', reject);
      (zip as any).on('error', reject);
      (zip as any).pipe(writable);
    });

    expect(Buffer.concat(written).toString('utf8')).toBe('zip-binary-content');
  });

  it('propagates stream reader errors for binary downloads', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async () => {
      return {
        ok: true,
        headers: {
          get(name: string) {
            return name.toLowerCase() === 'content-type'
              ? 'application/zip'
              : null;
          },
        },
        body: {
          getReader() {
            return {
              read: async () => {
                throw new Error('reader failed');
              },
              cancel: async () => undefined,
            };
          },
        },
        async blob() {
          return new Blob(['fallback']);
        },
        async json() {
          return {};
        },
        async text() {
          return '';
        },
      } as unknown as Response;
    }) as typeof fetch;

    const zip = await client.invoices.downloadZip('inv_123');
    await expect(
      new Promise((resolve, reject) => {
        (zip as any).on('error', reject);
        (zip as any).on('data', () => undefined);
        setTimeout(resolve, 50);
      }),
    ).rejects.toThrow('reader failed');
  });

  it('validates webhook signatures locally in Node crypto', async () => {
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

    expect(event.id).toBe('evt_123');
    expect(event.type).toBe('invoice.created');

    await expect(
      client.webhooks.validateSignature({
        secret,
        signature: crypto
          .createHmac('sha256', 'different_secret')
          .update(payload)
          .digest('hex'),
        payload,
      }),
    ).rejects.toThrow('Invalid signature');
  });

  it('falls back to API validation when local crypto is unavailable', async () => {
    const client = createClient();
    const originalBuffer = (globalThis as any).Buffer;
    const cryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');

    (globalThis as any).Buffer = undefined;
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe('https://api.test.local/v2/webhooks/validate-signature');
      expect(options?.method).toBe('POST');
      expect(getHeader(options?.headers, 'Authorization')).toBe('Bearer sk_test_123');
      return {
        ok: true,
        headers: {
          get(name: string) {
            return name.toLowerCase() === 'content-type'
              ? 'application/json'
              : null;
          },
        },
        async json() {
          return {
            id: 'evt_remote_123',
            type: 'invoice.created',
          };
        },
        async text() {
          return '';
        },
      } as unknown as Response;
    }) as typeof fetch;

    try {
      const event = await client.webhooks.validateSignature({
        secret: 'whsec_test',
        signature: 'deadbeef',
        payload: '{"id":"evt_remote_123","type":"invoice.created"}',
      });
      expect(event.id).toBe('evt_remote_123');
      expect(event.type).toBe('invoice.created');
    } finally {
      (globalThis as any).Buffer = originalBuffer;
      if (cryptoDescriptor) {
        Object.defineProperty(globalThis, 'crypto', cryptoDescriptor);
      }
    }
  });

  it('rejects unsupported upload inputs with a clear error', async () => {
    const client = createClient();
    await expect(
      client.organizations.uploadLogo('org_123', { invalid: true } as any),
    ).rejects.toThrow(/Unsupported file input type/);
  });

  it('serializes query params consistently with URLSearchParams semantics', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices?search=a+b&page=2&active=true&empty=&tags=x%2Cy',
      );
      return new Response(
        JSON.stringify({
          data: [],
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      );
    }) as typeof fetch;

    await client.invoices.list({
      search: 'a b',
      page: 2,
      active: true,
      empty: '',
      tags: ['x', 'y'] as unknown as string,
    });
  });
});
