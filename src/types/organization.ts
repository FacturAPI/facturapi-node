import { GlobalInvoicePeriodicity, TaxSystem } from '../enums';
import { Address } from './common';

export interface Series {
  series: string;
  next_folio: number;
  next_folio_test: number;
}

export interface ApiKeys {
  id: string;
  first_12: string;
  created_at: string;
}

export interface Organization {
  id: string;
  created_at: Date;
  plan: string;
  is_production_ready: boolean;
  pending_steps: {
    type: string;
    description: string;
  }[];
  logo_url?: string | null;
  domain?: string | null;
  custom_domain?: string | null;
  timezone: string;
  legal: {
    name: string;
    legal_name: string;
    tax_id: string;
    tax_system: TaxSystem;
    address: Address;
    phone: string;
    website: string;
    support_email: string;
    curp: string;
  };
  customization: {
    color: string;
    // TODO: Delete?
    // next_folio_number: number;
    // next_folio_number_test: number;
    // default_series: this.default_series,
    pdf_extra: {
      codes: boolean;
      address_codes: boolean;
      product_key: boolean;
      round_unit_price: boolean;
      tax_breakdown: boolean;
      ieps_breakdown: boolean;
    };
    default_series: {
      I: string;
      E: string;
      P: string;
      N: string;
      T: string;
    };
    has_logo: string;
  };
  certificate: {
    has_certificate: boolean;
    updated_at?: Date | null;
    expires_at?: Date | null;
    serial_number?: string | null;
  };
  fiel: {
    has_certificate: boolean;
    updated_at?: Date | null;
    expires_at?: Date | null;
    serial_number?: string | null;
  };
  receipts: {
    periodicity: GlobalInvoicePeriodicity;
    duration_days: number;
    next_folio_number: number;
    next_folio_number_test: number;
  };
  self_invoice: {
    allowed_cfdi_uses: string[];
    apply_resico_isr: boolean;
  };
  pending_plan_update: {
    plan: string;
    scheduled_for: Date;
  };
}
