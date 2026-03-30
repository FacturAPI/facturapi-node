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

export interface OrganizationUserAccess {
  id: string;
  full_name: string;
  email: string;
  role: string | null;
  role_name: string | null;
  organization: string;
  operations: string[];
  created_at: string;
  updated_at: string;
}

export interface OrganizationInvite {
  id: string;
  created_at: string;
  email: string;
  organization_name: string;
  role: string | null;
  role_name: string | null;
  roles: string[];
  expires_at: string | null;
}

export interface OrganizationInviteCreateInput {
  email: string;
  role?: string;
}

export interface OrganizationInviteResponseInput {
  accept: boolean;
}

export interface OrganizationTeamRole {
  id: string;
  name: string;
  template_code: string | null;
  scope: string;
  organization: string | null;
  operations: string[];
  used_by: number;
  created_at: string;
  updated_at: string;
  created_by?: Record<string, any> | null;
  updated_by?: Record<string, any> | null;
}

export interface OrganizationTeamRoleCreateInput {
  name: string;
  template_code?: string | null;
  add?: string[];
  remove?: string[];
}

export interface OrganizationTeamRoleUpdateInput {
  name?: string;
  template_code?: string | null;
  add?: string[];
  remove?: string[];
}

export interface OrganizationTeamRoleTemplate {
  code: string;
  name: string;
  description: string;
  operations: string[];
}

export interface Organization {
  id: string;
  created_at: Date;
  /**
   * @deprecated Organization-level plans are no longer offered. Use the add_ons property to determine contracted features.
   */
  plan: string | null;
  add_ons: string[];
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
      render_carta_porte: boolean;
      repeat_signature: boolean;
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
    support_email: string;
    support_email_verified: boolean;
  };
  pending_plan_update: {
    plan: string;
    scheduled_for: Date;
  };
}
