import { Receipt } from './receipt';
import { Invoice } from './invoice';

export enum ApiEventType {
  RECEIPT_SELF_INVOICE_COMPLETE = 'receipt.self_invoice_complete',
  INVOICE_CANCELLATION_STATUS_UPDATED = 'invoice.cancellation_status_updated',
  RECEIPT_STATUS_UPDATED = 'receipt.status_updated',
  GLOBAL_INVOICE = 'invoice.global_invoice_created',
  INVOICES_STATUS_UPDATED = 'invoice.status_updated',
}

export enum ApiEventDataType {
  RECEIPT = 'receipt',
  INVOICE = 'invoice',
}

type ApiEventTypeMap = {
  [ApiEventType.RECEIPT_SELF_INVOICE_COMPLETE]: ApiEventDataType.RECEIPT;
  [ApiEventType.INVOICE_CANCELLATION_STATUS_UPDATED]: ApiEventDataType.INVOICE;
  [ApiEventType.RECEIPT_STATUS_UPDATED]: ApiEventDataType.RECEIPT;
  [ApiEventType.GLOBAL_INVOICE]: ApiEventDataType.INVOICE;
  [ApiEventType.INVOICES_STATUS_UPDATED]: ApiEventDataType.INVOICE;
  '': '';
};

type ApiEventDataTypeMap = {
  [ApiEventDataType.RECEIPT]: Receipt;
  [ApiEventDataType.INVOICE]: Invoice;
  '': any;
};

export enum WebhookEndpointStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export interface Webhook {
  created_at: Date;
  organization: string;
  livemode: boolean;
  enabled_events: (ApiEventType | '*')[];
  description?: string;
  url: string;
  secret?: string;
  status: WebhookEndpointStatus;
}

export interface ApiEventData<T extends ApiEventDataType | '' = ''> {
  type: T;
  object: ApiEventDataTypeMap[T];
}

export interface ApiEvent<T extends ApiEventType | '' = ''> {
  created_at: Date;
  organization: string;
  livemode: boolean;
  type: T extends '' ? ApiEventType : T;
  data: ApiEventData<ApiEventTypeMap[T]>;
}
