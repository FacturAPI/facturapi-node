import { TaxType, TaxFactor, IepsMode, TaxSystem } from '../enums';

export interface Address {
  street?: string | null;
  exterior?: string | null;
  interior?: string | null;
  neighborhood: string;
  zip: string;
  city?: string | null;
  municipality?: string | null;
  state?: string | null;
  country: string;
}

export interface SearchResult<T> {
  page: number;
  total_pages: number;
  total_results: number;
  data: T[];
}

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
  property_tax_account: string;
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
