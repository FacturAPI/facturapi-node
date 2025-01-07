import {
  CancellationMotive,
  CancellationStatus,
  InvoiceComplementType,
  InvoiceStatus,
  InvoiceType,
  InvoiceUse,
  InvoicingPeriod,
  IssuingType,
  PaymentForm,
  PaymentMethod,
} from '../enums';
import {
  Address,
  CustomerInfo,
  InvoiceItem,
  RelatedDocument,
  XmlNamespace,
} from './common';
import { NominaComplementData, PagoComplementData } from './complements';

export interface GlobalInfo {
  periodicity: InvoicingPeriod;
  months: string;
  year: number;
}

export interface InvoiceComplement {
  type: InvoiceComplementType;
  data: string | PagoComplementData | NominaComplementData;
}

export interface Invoice {
  id: string;
  organization: string;
  livemode: boolean;
  created_at: Date;
  date: Date;
  issuer_type: IssuingType;
  type: InvoiceType;
  status: InvoiceStatus;
  cfdi_version: number;
  issuer_info: CustomerInfo;
  payment_form: PaymentForm;
  payment_method: PaymentMethod;
  currency: string;
  exchange: number;
  uuid: string;
  customer: CustomerInfo;
  total: number;
  use: InvoiceUse;
  folio_number: number | string;
  series: string;
  is_ready_to_stamp: boolean;
  items: InvoiceItem[];
  address: Address;
  amount_due?: number | null;
  verification_url?: string | null;
  verification_carta_porte?: string | null;
  cancellation_status: CancellationStatus;
  external_id?: string | null;
  idempotency_key?: string | null;
  stamp?: {
    date: string;
    sat_signature: string;
    sat_cert_number: string;
    signature: string;
    complement_string: string;
  } | null;
  addenda?: string | null;
  conditions: string | null;

  pdf_custom_section: string | null;
  export?: string | null;
  global?: GlobalInfo | null;
  cancellation?: {
    requested_at: Date;
    status: CancellationStatus;
    last_checked: Date;
    motive: string;
    substitutionUUID: string;
  } | null;
  complements?: InvoiceComplement[] | null;
  related_documents?: RelatedDocument[] | null;
  namespaces?: XmlNamespace[] | null;
  received_payment_ids?: string[] | null;
  target_invoice_ids?: string[] | null;
}

export interface CancelInvoiceOptions {
  motive: CancellationMotive;
  substitution?: string;
}
