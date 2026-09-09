import { afterEach, describe, expect, it, vi } from 'vitest'

import Facturapi from '../../src'

const originalFetch = globalThis.fetch

function createClient() {
  const client = new Facturapi('sk_test_123')
  client.BASE_URL = 'https://api.test.local/v2'
  return client
}

afterEach(() => {
  globalThis.fetch = originalFetch
  vi.restoreAllMocks()
})

describe('query param serialization', () => {
  it('serializes a nested date range object with bracket notation', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices?limit=100&q=laboratorio+ramos&date%5Bgte%5D=2026-01-01&date%5Blt%5D=2026-02-01',
      )
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    await client.invoices.list({
      limit: 100,
      q: 'laboratorio ramos',
      date: { gte: '2026-01-01', lt: '2026-02-01' },
    })
  })

  it('serializes arrays with repeated empty-bracket keys', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices?status%5B%5D=valid&status%5B%5D=canceled',
      )
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    await client.invoices.list({ status: ['valid', 'canceled'] })
  })

  it('skips null, undefined, and empty collections', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe('https://api.test.local/v2/invoices?page=2')
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    await client.invoices.list({
      page: 2,
      q: null,
      date: undefined,
      status: [],
      empty: {},
    })
  })

  it('serializes Date values as ISO 8601 strings', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices?date%5Bgte%5D=2026-01-01T00%3A00%3A00.000Z',
      )
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    await client.invoices.list({
      date: { gte: new Date('2026-01-01T00:00:00.000Z') },
    })
  })

  it('keeps flat params encoded exactly as before', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url) => {
      expect(url).toBe(
        'https://api.test.local/v2/organizations/domain-check?domain=empresa-demo',
      )
      return new Response(JSON.stringify({ available: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }) as typeof fetch

    await client.organizations.checkDomainIsAvailable({
      domain: 'empresa-demo',
    })
  })
})
