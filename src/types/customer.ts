import { InvoiceUse } from '../enums';
import { Address } from './common';

export interface TaxInfoValidationError {
  path: string;
  message: string;
}

export interface TaxInfoValidation {
  is_valid: boolean;
  errors: TaxInfoValidationError[];
}

export interface Customer {
  id: string;
  livemode: boolean;
  organization: string;
  created_at: Date;
  tax_id: string;
  tax_system?: string;
  legal_name: string;
  email: string;
  phone?: string;
  curp?: string;
  address: Address;
  external_id?: string;
  default_invoice_use?: InvoiceUse;
}
