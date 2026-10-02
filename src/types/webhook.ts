import type { components } from '../generated/output'
import type { components as Input } from '../generated/input'

export enum ApiEventType {
  RECEIPT_SELF_INVOICE_COMPLETE = 'receipt.self_invoice_complete',
  INVOICE_CANCELLATION_STATUS_UPDATED = 'invoice.cancellation_status_updated',
  RECEIPT_STATUS_UPDATED = 'receipt.status_updated',
  GLOBAL_INVOICE = 'invoice.global_invoice_created',
  INVOICES_STATUS_UPDATED = 'invoice.status_updated',
  INVOICES_CREATED_FROM_DASHBOARD = 'invoice.created_from_dashboard',
  CUSTOMER_EDIT_LINK_COMPLETED = 'customer.edit_link_completed',
}

export enum ApiEventDataType {
  RECEIPT = 'receipt',
  INVOICE = 'invoice',
  CUSTOMER = 'customer',
}

export enum WebhookEndpointStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export type Webhook = components['schemas']['Webhook']
export type ApiEvent<T extends ApiEventType | '' = ''> = Extract<
  components['schemas']['ApiEvent'],
  { type: T extends '' ? `${ApiEventType}` : `${T}` }
>
export type ApiEventData<T extends ApiEventDataType | '' = ''> = Extract<
  ApiEvent['data'],
  { type: T extends '' ? `${ApiEventDataType}` : `${T}` }
>
export type ApiEventPayload<T extends ApiEventType | '' = ''> = Extract<
  Input['schemas']['ApiEvent'],
  { type: T extends '' ? `${ApiEventType}` : `${T}` }
>
