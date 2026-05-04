import type { ReceiptStatus } from '../enums'
import type { InvoiceItem } from './common'
import type { Invoice } from './invoice'

export interface Receipt {
  id: string
  created_at: Date
  date: Date
  api_version: number
  livemode: boolean
  organization: string
  folio_number?: number
  external_id?: string
  idempotency_key?: string
  branch: string
  payment_form: string
  items: InvoiceItem[]
  currency: string
  exchange: number
  total: number
  invoice: string
  expires_at: Date
  key: string
  status: ReceiptStatus
  self_invoice_url: string
}

export interface ReceiptsToInvoiceInput {
  keys: string[]
  customer?: Record<string, any>
  use?: string
  dry_run?: boolean
  payment_form?: string | null
}

export interface PreviewReceiptsToInvoicePdfInput {
  keys: string[]
  customer?: Record<string, any> | null
  use?: string
}
