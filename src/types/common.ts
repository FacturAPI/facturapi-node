import { TaxType, TaxFactor, IepsMode, TaxSystem } from '../enums';

export interface Address {
  street?: string | null;
  exterior?: string | null;
  interior?: string | null;
  neighborhood?: string | null;
  zip: string;
  city?: string | null;
  municipality?: string | null;
  state?: string | null;
  country: string;
}

export interface SearchResult<T> {
  /** Page number. Absent in cursor searches and when the search has no matches. */
  page?: number;
  /** Total pages derived from the (possibly capped) total. Absent in cursor searches. */
  total_pages?: number;
  /**
   * Total matching results. Capped (approximate) when `totals_are_capped` is
   * true, and only reported on the first request of a cursor sequence.
   */
  total_results?: number;
  /** True when total_results is capped at the maximum search count. */
  totals_are_capped?: boolean;
  /** Cursor to the previous slice (cursor searches only). */
  previous_cursor?: string | null;
  /** Cursor to the next slice (cursor searches only). */
  next_cursor?: string | null;
  data: T[];
}

/** Params that select page pagination (the default). */
export type PageSearchParams = ({ pagination?: 'page' } | { page: number }) &
  Record<string, any>;

/** Params that select cursor pagination (page mode is the default). */
export type CursorSearchParams = ({ pagination: 'cursor' } | { after: string } | { before: string }) &
  Record<string, any>;

export interface InvoiceItemPart {
  quantity: number;
  product_key: string;
  description: string;
  unit_name: string;
  sku: string;
  unit_price: number;
}

export interface InvoiceItemThirdParty {
  tax_id: string;
  legal_name: string;
  tax_system: string;
  zip: string;
}

export interface Tax {
  base?: number;
  amount: number;
  rate: number;
  type: TaxType;
  withholding: boolean;
  factor: TaxFactor;
  ieps_mode?: IepsMode;
}

export interface LocalTax {
  rate: number;
  type: string;
  withholding: boolean;
  base?: number;
  factor?: TaxFactor;
}

export interface ProductInfo {
  id?: string;
  description: string;
  product_key: string;
  unit_key: string;
  unit_name: string;
  price: number;
  taxability: string;
  tax_included: boolean;
  taxes: Tax[];
  local_taxes: LocalTax[];
  sku: string;
}

export interface CustomerInfo {
  id?: string;
  legal_name: string;
  tax_id: string;
  tax_system: TaxSystem;
  address: {
    zip: string;
    country: string;
  };
}

export interface InvoiceItem {
  quantity: number;
  product: ProductInfo;
  discount: number;
  customs_keys: [string];
  third_party: InvoiceItemThirdParty;
  complement: string;
  parts: InvoiceItemPart[];
  property_tax_account: string[];
}

export interface XmlNamespace {
  prefix: string;
  uri: string;
  schema_location: string;
}

export interface RelatedDocument {
  relationship: string;
  uuid: string;
}

export interface GenericResponse {
  ok: boolean;
}

export interface SendEmailBody {
  email?: string | string[];
}

export interface NodeLikeReadableStream {
  pipe?<T = unknown>(destination: T, options?: { end?: boolean }): T;
  on(event: 'data', listener: (chunk: unknown) => void): unknown;
  on(event: 'end', listener: () => void): unknown;
  on(event: 'error', listener: (error: unknown) => void): unknown;
}

export type BinaryDownload = Blob | NodeLikeReadableStream;
export type BinaryInput =
  | Blob
  | File
  | ArrayBuffer
  | Uint8Array
  | NodeLikeReadableStream;

/**
 * A short-lived URL that downloads one representation of a document.
 *
 * The URL is a bearer credential for that file: whoever holds it can download
 * it until `expires_at`. It belongs in the hands of the caller's own user, not
 * in storage or logs.
 */
export interface SignedDownloadUrl {
  url: string;
  expires_at: Date;
  content_type: string;
  filename: string;
}
