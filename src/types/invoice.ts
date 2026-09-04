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
  data: string | PagoComplementData[] | NominaComplementData;
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
    rfc_provider_cert: string;
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

export interface CreateZipRequestData {
  year: number;
  month: number;
  issuer_type: IssuingType;
  invoice_types?: InvoiceType[];
}

export interface ListZipRequestsParams {
  year?: number;
  month?: number;
  status?: string;
  limit?: number;
  page?: number;
}

export interface ZipRequest {
  id: string;
  year: number;
  month: number;
  issuer_type: IssuingType;
  invoice_types: InvoiceType[];
  status: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface PaymentSummaryParams {
  /**
   * Amount being paid on the invoice, expressed in the invoice currency.
   * Cannot exceed the outstanding balance.
   */
  amount: number;
}

export interface PaymentSummaryTax {
  /** Tax base prorated to the paid amount */
  base: number;
  /** Tax rate or quota */
  rate: number;
  /** Tax type (VAT, income tax, etc.) */
  type: string;
  /** Factor type (Rate, Exempt, etc.) */
  factor: string;
  /** Whether this tax is a withholding */
  withholding: boolean;
}

export interface PaymentSummary {
  /** Invoice UUID */
  uuid: string;
  folio_number?: number | null;
  series?: string | null;
  /** Installment number corresponding to this payment */
  installment: number;
  /** Invoice outstanding balance before this payment */
  last_balance: number;
  /** Invoice total */
  total: number;
  /** Invoice currency */
  currency: string;
  /** Amount paid in this installment */
  amount: number;
  /** Invoice taxes prorated to the paid amount */
  taxes: PaymentSummaryTax[];
}
