exports.PaymentForm = {
  EFECTIVO: '01',
  CHEQUE_NOMINATIVO: '02',
  TRANSFERENCIA_ELECTRONICA: '03',
  TARJETA_DE_CREDITO: '04',
  MONEDERO_ELECTRONICO: '05',
  DINERO_ELECTRONICO: '06',
  VALES_DE_DESPENSA: '08',
  DACION_EN_PAGO: '12',
  SUBROGACION: '13',
  CONSIGNACION: '14',
  CONDONACION: '15',
  COMPENSACION: '17',
  NOVACION: '23',
  CONFUSION: '24',
  REMISION_DE_DEUDA: '25',
  PRESCRIPCION_O_CADUCIDAD: '26',
  A_SATISFACCION_DEL_ACREEDOR: '27',
  TARJETA_DE_DEBITO: '28',
  TARJETA_DE_SERVICIOS: '29',
  POR_DEFINIR: '99'
};

exports.PaymentFormList = [
  { value: '01', label: 'Efectivo' },
  { value: '02', label: 'Cheque nominativo' },
  { value: '03', label: 'Transferencia electrónica de fondos' },
  { value: '04', label: 'Tarjeta de crédito' },
  { value: '05', label: 'Monedero electrónico' },
  { value: '06', label: 'Dinero electrónico' },
  { value: '08', label: 'Vales de despensa' },
  { value: '12', label: 'Dación en pago' },
  { value: '13', label: 'Pago por subrogación' },
  { value: '14', label: 'Pago por consignación' },
  { value: '15', label: 'Condonación' },
  { value: '17', label: 'Compensación' },
  { value: '23', label: 'Novación' },
  { value: '24', label: 'Confusión' },
  { value: '25', label: 'Remisión de deuda' },
  { value: '26', label: 'Prescripción o caducidad' },
  { value: '27', label: 'A satisfacción del acreedor' },
  { value: '28', label: 'Tarjeta de débito' },
  { value: '29', label: 'Tarjeta de servicios' },
  { value: '99', label: 'Por definir' }
];

exports.TaxType = {
  IVA: 'IVA',
  IEPS: 'IEPS',
  ISR: 'ISR'
};
