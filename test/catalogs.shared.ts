import { afterEach, describe, expect, it, vi } from 'vitest';
import Facturapi from '../src';

afterEach(() => vi.unstubAllGlobals());

describe('address and fiscal catalogs', () => {
  it('sends search parameters through HTTP and preserves catalog keys', async () => {
    const client = new Facturapi('sk_test_example');
    client.BASE_URL = 'https://api.example.com/v2';
    const page = {
      page: 2,
      total_pages: 3,
      total_results: 25,
      data: [{ key: '01000', description: 'Catalog entry' }],
    };
    const fetch = vi.fn(async () => Response.json(page));
    vi.stubGlobal('fetch', fetch);
    for (const [method, path] of [
      ['searchZipCodes', 'zip-codes'],
      ['searchCountries', 'countries'],
      ['searchTaxSystems', 'tax-systems'],
      ['searchInvoiceUses', 'invoice-uses'],
    ] as const) {
      fetch.mockClear();
      expect(
        await client.catalogs[method]({ q: '01', page: 2, limit: 10 }),
      ).toEqual(page);
      expect(fetch).toHaveBeenCalledExactlyOnceWith(
        `https://api.example.com/v2/catalogs/${path}?q=01&page=2&limit=10`,
        expect.objectContaining({ method: 'GET' }),
      );
    }
  });

  it('browses specialized catalogs without a query string', async () => {
    const client = new Facturapi('sk_test_example');
    client.BASE_URL = 'https://api.example.com/v2';
    const page = { page: 0, total_pages: 0, total_results: 0, data: [] };
    const fetch = vi.fn(async () => Response.json(page));
    vi.stubGlobal('fetch', fetch);
    expect(await client.nominaCatalogs.searchDeductions()).toEqual(page);
    expect(
      await client.cartaPorteCatalogs.searchAirTransportCodes({ page: 1 }),
    ).toEqual(page);
    expect(
      await client.comercioExteriorCatalogs.searchTariffFractions({
        limit: 10,
      }),
    ).toEqual(page);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'https://api.example.com/v2/catalogs/deductions',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'https://api.example.com/v2/catalogs/cartaporte/3.1/air-transport-codes?page=1',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      'https://api.example.com/v2/catalogs/comercioexterior/2.0/tariff-fractions?limit=10',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('retrieves postal-code details and URL-encodes the code argument', async () => {
    const client = new Facturapi('sk_test_example');
    client.BASE_URL = 'https://api.example.com/v2';
    const detail = {
      key: '01000',
      country: { key: 'MEX', description: 'México' },
      state: null,
      municipality: null,
      locality: null,
      neighborhoods: [{ key: '0001', description: 'Centro' }],
    };
    const fetch = vi.fn(async () => Response.json(detail));
    vi.stubGlobal('fetch', fetch);
    expect(await client.catalogs.getZipCode('01000')).toEqual(detail);
    expect(fetch).toHaveBeenLastCalledWith(
      'https://api.example.com/v2/catalogs/zip-codes/01000',
      expect.objectContaining({ method: 'GET' }),
    );
    await client.catalogs.getZipCode('01/000');
    expect(fetch).toHaveBeenLastCalledWith(
      'https://api.example.com/v2/catalogs/zip-codes/01%2F000',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
