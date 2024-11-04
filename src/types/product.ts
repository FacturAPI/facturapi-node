import type { LocalTax, Tax } from './common';

export interface Product {
  id: string;
  organization: string;
  livemode: boolean;
  product_key: string;
  description: string;
  price: number;
  created_at: Date;
  tax_included: boolean;
  taxability: string;
  taxes: Tax[];
  local_taxes: LocalTax[];
  unit_key: string;
  unit_name: string;
}
