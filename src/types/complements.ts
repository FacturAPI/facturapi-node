export interface PaymentRelatedDocumentTax {
  base: number;
  rate: number;
  type: string;
  factor: string;
  withholding: boolean;
}

export interface PaymentRelatedDocument {
  uuid: string;
  amount: number;
  installment: number;
  last_balance: number;
  currency: string;
  exchange: number;
  folio_number: string;
  series: string;
  taxability?: string;
  taxes: PaymentRelatedDocumentTax[];
}

export interface PagoComplementData {
  payment_form: string;
  date: Date;
  related_documents: PaymentRelatedDocument[];
  currency: string;
  exchange: number;
  numOperacion: string;
  rfcEmisorCtaOrd: string;
  nomBancoOrdExt: string;
  ctaOrdenante: string;
  rfcEmisorCtaBen: string;
  ctaBeneficiario: string;
  tipoCadPago: string;
  certPago: string;
  cadPago: string;
  selloPago: string;
}

export interface NominaReceptor {
  curp?: string;
  num_seguridad_social?: string;
  fecha_inicio_rel_laboral?: Date | string;
  antiguedad: boolean | string;
  tipo_contrato: string;
  sindicalizado?: boolean;
  tipo_jornada?: string;
  tipo_regimen: string;
  num_empleado: string;
  departamento?: string;
  puesto?: string;
  riesgo_puesto?: string;
  periodicidad_pago: string;
  banco?: string;
  nombre_banco?: string;
  cuenta_bancaria?: string;
  salario_base_cot_apor?: number;
  salario_diario_integrado?: number;
  clave_ent_fed: string;
  sub_contratacion?: {
    rfc_labora: string;
    porcentaje_tiempo: number;
  }[];
}

export interface NominaComplementData {
  fecha_inicial_pago: string | Date;
  fecha_final_pago: string | Date;
  percepciones: any;
  deducciones: any;
  otros_pagos: any;
  incapacidades: any;
  emisor: any;
  receptor: NominaReceptor;
  tipo_nomina: string;
  fecha_pago: string | Date;
  num_dias_pagados: number;
}
