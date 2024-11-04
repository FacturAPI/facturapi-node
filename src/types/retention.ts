import { InvoiceStatus } from '../enums';
import { CustomerInfo, RelatedDocument, XmlNamespace } from './common';

export interface Retention {
  created_at: Date;
  customer: CustomerInfo;
  organization: string;
  livemode: boolean;
  status: InvoiceStatus;
  uuid: string;
  external_id?: string;
  fecha_exp: Date;
  cve_retenc: string;
  folio_int?: string;
  desc_retenc?: string;
  periodo: {
    mes_ini: number;
    mes_fin: number;
    ejerc: number;
  };
  totales: {
    monto_tot_grav: number;
    monto_tot_exent: number;
    monto_tot_operacion: number;
    monto_tot_ret: number;
    imp_retenidos: Array<{
      base_ret?: number;
      impuesto?: string;
      tipo_pago_ret: string;
      monto_ret: number;
      pago_provisional: boolean;
    }>;
  };
  namespaces?: XmlNamespace[];
  related_documents?: RelatedDocument[];
  complements?: string[];
  addenda?: string[];
  cancellation_receipt?: string;
  stamp?: {
    date: string;
    sat_signature: string;
    sat_cert_number: string;
    signature: string;
  };
  pdf_custom_section?: string;
  verification_url: string;
}
