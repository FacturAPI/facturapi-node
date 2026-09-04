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

describe('invoice payment summary', () => {
  it('requests the payment summary with the amount as a query parameter', async () => {
    const client = createClient()

    globalThis.fetch = vi.fn(async (url, options) => {
      expect(url).toBe(
        'https://api.test.local/v2/invoices/58e93bd8e86eb318b019743d/payment-summary?amount=100',
      )
      expect(options?.method).toBe('GET')
      return Response.json({
        uuid: '6CF6CE33-1BD2-4F88-A443-33013C069169',
        folio_number: 20,
        series: 'F',
        installment: 1,
        last_balance: 100,
        total: 100,
        currency: 'MXN',
        amount: 100,
        taxes: [
          {
            base: 86.206897,
            rate: 0.16,
            type: 'IVA',
            factor: 'Tasa',
            withholding: false,
          },
        ],
      })
    }) as typeof fetch

    const summary = await client.invoices.paymentSummary(
      '58e93bd8e86eb318b019743d',
      { amount: 100 },
    )
    expect(summary.installment).toBe(1)
    expect(summary.last_balance).toBe(100)
    expect(summary.taxes[0].type).toBe('IVA')
    expect(summary.taxes[0].withholding).toBe(false)
  })

  it('rejects when no id is provided', async () => {
    const client = createClient()
    await expect(
      client.invoices.paymentSummary('', { amount: 100 }),
    ).rejects.toThrow('id is required')
  })
})
