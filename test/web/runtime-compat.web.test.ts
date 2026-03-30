import { afterEach, describe, expect, it, vi } from 'vitest';

import Facturapi from '../../src';

const originalFetch = globalThis.fetch;
const originalBuffer = (globalThis as any).Buffer;
const originalBtoa = globalThis.btoa;

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
  (globalThis as any).Buffer = originalBuffer;
  globalThis.btoa = originalBtoa;
  vi.restoreAllMocks();
});

describe('runtime compatibility (web simulation)', () => {
  it('encodes basic auth with btoa when Buffer is unavailable', async () => {
    (globalThis as any).Buffer = undefined;
    globalThis.btoa = vi.fn((text: string) => {
      if (text === 'sk_test_123:') return 'c2tfdGVzdF8xMjM6';
      throw new Error(`Unexpected btoa input: ${text}`);
    });

    const client = createClient();

    globalThis.fetch = vi.fn(async (_url, options) => {
      expect(globalThis.btoa).toHaveBeenCalledWith('sk_test_123:');
      expect(getHeader(options?.headers, 'Authorization')).toBe(
        'Basic c2tfdGVzdF8xMjM6',
      );
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
          return { id: 'inv_123' };
        },
        async text() {
          return '';
        },
      } as unknown as Response;
    }) as typeof fetch;

    await client.invoices.retrieve('inv_123');
  });

  it('returns Blob for binary downloads when Buffer is unavailable', async () => {
    const client = createClient();
    (globalThis as any).Buffer = undefined;

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
      } as unknown as Response;
    }) as typeof fetch;

    const zip = await client.invoices.downloadZip('inv_123');
    expect(zip instanceof Blob).toBe(true);
    expect(await (zip as Blob).text()).toBe('zip-binary-content');
  });

  it('sends multipart FormData without forcing content-type header', async () => {
    const client = createClient();

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe('https://api.test.local/v2/organizations/org_123/logo');
      expect(options?.method).toBe('PUT');
      expect(options?.body instanceof FormData).toBe(true);
      expect(getHeader(options?.headers, 'Content-Type')).toBeUndefined();
      expect(getHeader(options?.headers, 'Authorization')).toMatch(/^Basic\s+/);

      return new Response(
        JSON.stringify({
          id: 'org_123',
          object: 'organization',
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      );
    }) as typeof fetch;

    const organization = await client.organizations.uploadLogo(
      'org_123',
      new Uint8Array([1, 2, 3]),
    );

    expect(organization.id).toBe('org_123');
  });

  it('validates webhook signatures through WebCrypto path', async () => {
    const client = createClient();
    (globalThis as any).Buffer = undefined;

    const payload = '{"id":"evt_web_123","type":"invoice.created"}';
    const secret = 'whsec_web_fixed';
    const precomputedSignature =
      'adffbea89398760c226a664f8e14d9e66b5105b84dabe8a2868638c650b05721';

    const event = await client.webhooks.validateSignature({
      secret,
      signature: precomputedSignature,
      payload,
    });

    expect(event.id).toBe('evt_web_123');
    expect(event.type).toBe('invoice.created');

    await expect(
      client.webhooks.validateSignature({
        secret,
        signature: 'deadbeef',
        payload,
      }),
    ).rejects.toThrow('Invalid signature');
  });
});
