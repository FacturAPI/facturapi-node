export enum PaymentForm {
  EFECTIVO = '01',
  CHEQUE_NOMINATIVO = '02',
  TRANSFERENCIA_ELECTRONICA_DE_FONDOS = '03',
  TARJETA_DE_CREDITO = '04',
  MONEDERO_ELECTRONICO = '05',
  DINERO_ELECTRONICO = '06',
  VALES_DE_DESPENSA = '08',
  DACION_EN_PAGO = '12',
  PAGO_POR_SUBROGACION = '13',
  PAGO_POR_CONSIGNACION = '14',
  CONDONACION = '15',
  COMPENSACION = '17',
  NOVACION = '23',
  CONFUSION = '24',
  REMISIÓN_DE_DEUDA = '25',
  PRESCRIPCION_O_CADUCIDAD = '26',
  A_SATISFACCION_DEL_ACREEDOR = '27',
  TARJETA_DE_DEBITO = '28',
  TARJETA_DE_SERVICIOS = '29',
  APLICACION_DE_ANTICIPOS = '30',
  INTERMEDIARIO_DE_PAGOS = '31',
  POR_DEFINIR = '99',
}

export const PaymentFormList = [
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
  { value: '30', label: 'Aplicación de anticipos' },
  { value: '31', label: 'Intermediario de pagos' },
  { value: '99', label: 'Por definir' },
] as const;

export enum CustomsRegimes {
  DEFINITIVE_IMPORT = 'IMD',
  DEFINITIVE_EXPORT = 'EXD',
  INTERNAL_MERCHANDISE_TRANSIT = 'ITR',
  INTERNAL_MERCHANDISE_TRANSIT_FOR_EXPORT = 'ITE',
  EXTERNAL_MERCHANDISE_TRANSIT = 'ETR',
  EXTERNAL_MERCHANDISE_TRANSIT_FOR_EXPORT = 'ETE',
  FISCAL_WAREHOUSE = 'DFI',
  STRATEGIC_FISCAL_ENCLOSURE = 'RFE',
  FISCAL_ENCLOSURE = 'RFS',
  CUSTOMS_TRANSIT = 'TRA',
}

export const CUSTOMS_REGIMES_DESCRIPTION = {
  [CustomsRegimes.DEFINITIVE_IMPORT]: 'Importación definitiva',
  [CustomsRegimes.DEFINITIVE_EXPORT]: 'Exportación definitiva',
  [CustomsRegimes.INTERNAL_MERCHANDISE_TRANSIT]:
    'Tránsito interno de mercancías',
  [CustomsRegimes.INTERNAL_MERCHANDISE_TRANSIT_FOR_EXPORT]:
    'Tránsito interno de mercancías para exportación',
  [CustomsRegimes.EXTERNAL_MERCHANDISE_TRANSIT]:
    'Tránsito externo de mercancías',
  [CustomsRegimes.EXTERNAL_MERCHANDISE_TRANSIT_FOR_EXPORT]:
    'Tránsito externo de mercancías para exportación',
  [CustomsRegimes.FISCAL_WAREHOUSE]: 'Depósito fiscal',
  [CustomsRegimes.STRATEGIC_FISCAL_ENCLOSURE]:
    'Recinto fiscalizado estratégico',
  [CustomsRegimes.FISCAL_ENCLOSURE]: 'Recinto fiscalizado',
  [CustomsRegimes.CUSTOMS_TRANSIT]: 'Tránsito aduanero',
};

export enum CveTransporteEnum {
  AUTOTRANSPORT = '01',
  NAVY_TRANSPORT = '02',
  AIRLINE_TRANSPORT = '03',
  RAIL_TRANSPORT = '04',
  OTHER = '05',
}

export const CVE_TRANSPORT_DESCRIPTION = {
  [CveTransporteEnum.AUTOTRANSPORT]: 'Autotransporte',
  [CveTransporteEnum.NAVY_TRANSPORT]: 'Transporte Marítimo',
  [CveTransporteEnum.AIRLINE_TRANSPORT]: 'Transporte Aéreo',
  [CveTransporteEnum.RAIL_TRANSPORT]: 'Transporte Ferroviario',
  [CveTransporteEnum.OTHER]: 'Otro',
};

export enum TipoEstacionEnum {
  NATIONAL_ORIGIN = '01',
  INTERMEDIATE = '02',
  FINAL_DESTINATION = '03',
}

export const TIPO_ESTACION_DESCRIPTION = {
  [TipoEstacionEnum.NATIONAL_ORIGIN]: 'Origen Nacional',
  [TipoEstacionEnum.INTERMEDIATE]: 'Intermedia',
  [TipoEstacionEnum.FINAL_DESTINATION]: 'Destino Final Nacional',
};

export enum PermisoSctEnum {
  FEDERAL_TRANSPORT_OF_LOAD = 'TPAF01',
  PRIVATE_TRANSPORT_OF_LOAD = 'TPAF02',
  FEDERAL_SPECIALIZED_HAZARDOUS_MATERIALS = 'TPAF03',
  TRANSPORT_OF_AUTOMOBILES = 'TPAF04',
  TRANSPORT_OF_HEAVY_LOAD_UP_TO_90_TONS = 'TPAF05',
  TRANSPORT_OF_SPECIALIZED_HEAVY_LOAD_OVER_90_TONS = 'TPAF06',
  PRIVATE_HAZARDOUS_MATERIALS_TRANSPORT = 'TPAF07',
  INTERNATIONAL_LONG_HAUL_TRANSPORT = 'TPAF08',
  INTERNATIONAL_SPECIALIZED_HAZARDOUS_LONG_HAUL = 'TPAF09',
  FEDERAL_TRANSPORT_US_BORDER_ZONE = 'TPAF10',
  FEDERAL_SPECIALIZED_US_BORDER_ZONE = 'TPAF11',
  AUXILIARY_TOWING_SERVICE = 'TPAF12',
  AUXILIARY_TOWING_AND_STORAGE_SERVICE = 'TPAF13',
  PACKAGING_AND_COURIER_SERVICE = 'TPAF14',
  SPECIAL_TRANSPORT_INDUSTRIAL_CRANES_UP_TO_90_TONS = 'TPAF15',
  FEDERAL_RENTAL_COMPANIES_SERVICE = 'TPAF16',
  VEHICLE_MOVERS_NEW_VEHICLES = 'TPAF17',
  MANUFACTURERS_DISTRIBUTORS_NEW_VEHICLES = 'TPAF18',
  AUTHORIZATION_DOUBLE_ARTICULATED_TRUCK = 'TPAF19',
  FEDERAL_SPECIALIZED_FUNDS_AND_VALUES = 'TPAF20',
  TEMPORARY_CABOTAGE_NAVIGATION = 'TPTM01',
  NATIONAL_INTERNATIONAL_REGULAR_SERVICE_MEXICAN = 'TPTA01',
  FOREIGN_COMPANIES_REGULAR_AIR_SERVICE = 'TPTA02',
  NATIONAL_INTERNATIONAL_CHARTER_SERVICE = 'TPTA03',
  NATIONAL_INTERNATIONAL_AIR_TAXI_SERVICE = 'TPTA04',
  NOT_IN_CATALOG = 'TPXX00',
}

export const PERMISO_SCT_DESCRIPTIONS = {
  [PermisoSctEnum.FEDERAL_TRANSPORT_OF_LOAD]:
    'Autotransporte Federal de carga general.',
  [PermisoSctEnum.PRIVATE_TRANSPORT_OF_LOAD]: 'Transporte privado de carga.',
  [PermisoSctEnum.FEDERAL_SPECIALIZED_HAZARDOUS_MATERIALS]:
    'Autotransporte Federal de Carga Especializada de materiales y residuos peligrosos.',
  [PermisoSctEnum.TRANSPORT_OF_AUTOMOBILES]:
    'Transporte de automóviles sin rodar en vehículo tipo góndola.',
  [PermisoSctEnum.TRANSPORT_OF_HEAVY_LOAD_UP_TO_90_TONS]:
    'Transporte de carga de gran peso y/o volumen de hasta 90 toneladas.',
  [PermisoSctEnum.TRANSPORT_OF_SPECIALIZED_HEAVY_LOAD_OVER_90_TONS]:
    'Transporte de carga especializada de gran peso y/o volumen de más 90 toneladas.',
  [PermisoSctEnum.PRIVATE_HAZARDOUS_MATERIALS_TRANSPORT]:
    'Transporte Privado de materiales y residuos peligrosos.',
  [PermisoSctEnum.INTERNATIONAL_LONG_HAUL_TRANSPORT]:
    'Autotransporte internacional de carga de largo recorrido.',
  [PermisoSctEnum.INTERNATIONAL_SPECIALIZED_HAZARDOUS_LONG_HAUL]:
    'Autotransporte internacional de carga especializada de materiales y residuos peligrosos de largo recorrido.',
  [PermisoSctEnum.FEDERAL_TRANSPORT_US_BORDER_ZONE]:
    'Autotransporte Federal de Carga General cuyo ámbito de aplicación comprende la franja fronteriza con Estados Unidos.',
  [PermisoSctEnum.FEDERAL_SPECIALIZED_US_BORDER_ZONE]:
    'Autotransporte Federal de Carga Especializada cuyo ámbito de aplicación comprende la franja fronteriza con Estados Unidos.',
  [PermisoSctEnum.AUXILIARY_TOWING_SERVICE]:
    'Servicio auxiliar de arrastre en las vías generales de comunicación.',
  [PermisoSctEnum.AUXILIARY_TOWING_AND_STORAGE_SERVICE]:
    'Servicio auxiliar de servicios de arrastre, arrastre y salvamento, y depósito de vehículos en las vías generales de comunicación.',
  [PermisoSctEnum.PACKAGING_AND_COURIER_SERVICE]:
    'Servicio de paquetería y mensajería en las vías generales de comunicación.',
  [PermisoSctEnum.SPECIAL_TRANSPORT_INDUSTRIAL_CRANES_UP_TO_90_TONS]:
    'Transporte especial para el tránsito de grúas industriales con peso máximo de 90 toneladas.',
  [PermisoSctEnum.FEDERAL_RENTAL_COMPANIES_SERVICE]:
    'Servicio federal para empresas arrendadoras servicio público federal.',
  [PermisoSctEnum.VEHICLE_MOVERS_NEW_VEHICLES]:
    'Empresas trasladistas de vehículos nuevos.',
  [PermisoSctEnum.MANUFACTURERS_DISTRIBUTORS_NEW_VEHICLES]:
    'Empresas fabricantes o distribuidoras de vehículos nuevos.',
  [PermisoSctEnum.AUTHORIZATION_DOUBLE_ARTICULATED_TRUCK]:
    'Autorización expresa para circular en los caminos y puentes de jurisdicción federal con configuraciones de tractocamión doblemente articulado.',
  [PermisoSctEnum.FEDERAL_SPECIALIZED_FUNDS_AND_VALUES]:
    'Autotransporte Federal de Carga Especializada de fondos y valores.',
  [PermisoSctEnum.TEMPORARY_CABOTAGE_NAVIGATION]:
    'Permiso temporal para navegación de cabotaje',
  [PermisoSctEnum.NATIONAL_INTERNATIONAL_REGULAR_SERVICE_MEXICAN]:
    'Concesión y/o autorización para el servicio regular nacional y/o internacional para empresas mexicanas',
  [PermisoSctEnum.FOREIGN_COMPANIES_REGULAR_AIR_SERVICE]:
    'Permiso para el servicio aéreo regular de empresas extranjeras',
  [PermisoSctEnum.NATIONAL_INTERNATIONAL_CHARTER_SERVICE]:
    'Permiso para el servicio nacional e internacional no regular de fletamento',
  [PermisoSctEnum.NATIONAL_INTERNATIONAL_AIR_TAXI_SERVICE]:
    'Permiso para el servicio nacional e internacional no regular de taxi aéreo',
  [PermisoSctEnum.NOT_IN_CATALOG]: 'Permiso no contemplado en el catálogo.',
};

export enum SectorCofeprisEnum {
  MEDICINE = '01',
  PRECURSORS_AND_DUAL_USE_CHEMICALS = '02',
  PSYCHOTROPIC_AND_NARCOTIC = '03',
  TOXIC_SUBSTANCES = '04',
  PESTICIDES_AND_FERTILIZERS = '05',
}

export const SECTOR_COFEPRIS_DESCRIPTIONS = {
  [SectorCofeprisEnum.MEDICINE]: 'Medicamento',
  [SectorCofeprisEnum.PRECURSORS_AND_DUAL_USE_CHEMICALS]:
    'Precursores y químicos de uso dual',
  [SectorCofeprisEnum.PSYCHOTROPIC_AND_NARCOTIC]:
    'Psicotrópicos y estupefacientes',
  [SectorCofeprisEnum.TOXIC_SUBSTANCES]: 'Sustancias tóxicas',
  [SectorCofeprisEnum.PESTICIDES_AND_FERTILIZERS]:
    'Plaguicidas y fertilizantes',
};

export enum PharmaceuticalFormsEnum {
  TABLET = '01',
  CAPSULES = '02',
  COMPRESSED = '03',
  SUGAR_COATED = '04',
  SUSPENSION = '05',
  SOLUTION = '06',
  EMULSION = '07',
  SYRUP = '08',
  INJECTABLE = '09',
  CREAM = '10',
  OINTMENT = '11',
  AEROSOL = '12',
  MEDICINAL_GAS = '13',
  GEL = '14',
  IMPLANT = '15',
  OVULE = '16',
  PATCH = '17',
  PASTE = '18',
  POWDER = '19',
  SUPPOSITORY = '20',
}

export const PHARMACEUTICAL_FORM_DESCRIPTIONS = {
  [PharmaceuticalFormsEnum.TABLET]: 'Tableta',
  [PharmaceuticalFormsEnum.CAPSULES]: 'Cápsulas',
  [PharmaceuticalFormsEnum.COMPRESSED]: 'Comprimidos',
  [PharmaceuticalFormsEnum.SUGAR_COATED]: 'Grageas',
  [PharmaceuticalFormsEnum.SUSPENSION]: 'Suspensión',
  [PharmaceuticalFormsEnum.SOLUTION]: 'Solución',
  [PharmaceuticalFormsEnum.EMULSION]: 'Emulsión',
  [PharmaceuticalFormsEnum.SYRUP]: 'Jarabe',
  [PharmaceuticalFormsEnum.INJECTABLE]: 'Inyectable',
  [PharmaceuticalFormsEnum.CREAM]: 'Crema',
  [PharmaceuticalFormsEnum.OINTMENT]: 'Ungüento',
  [PharmaceuticalFormsEnum.AEROSOL]: 'Aerosol',
  [PharmaceuticalFormsEnum.MEDICINAL_GAS]: 'Gas medicinal',
  [PharmaceuticalFormsEnum.GEL]: 'Gel',
  [PharmaceuticalFormsEnum.IMPLANT]: 'Implante',
  [PharmaceuticalFormsEnum.OVULE]: 'Óvulo',
  [PharmaceuticalFormsEnum.PATCH]: 'Parche',
  [PharmaceuticalFormsEnum.PASTE]: 'Pasta',
  [PharmaceuticalFormsEnum.POWDER]: 'Polvo',
  [PharmaceuticalFormsEnum.SUPPOSITORY]: 'Supositorio',
};

export enum SpecialConditionsEnum {
  FROZEN = '01',
  REFRIGERATED = '02',
  CONTROLLED_TEMPERATURE = '03',
  ROOM_TEMPERATURE = '04',
}

export const SPECIAL_CONDITION_DESCRIPTIONS = {
  [SpecialConditionsEnum.FROZEN]: 'Congelados',
  [SpecialConditionsEnum.REFRIGERATED]: 'Refrigerados',
  [SpecialConditionsEnum.CONTROLLED_TEMPERATURE]: 'Temperatura controlada',
  [SpecialConditionsEnum.ROOM_TEMPERATURE]: 'Temperatura ambiente',
};

export enum MaterialTypeEnum {
  RAW_MATERIAL = '01',
  PROCESSED_MATERIAL = '02',
  FINISHED_MATERIAL = '03',
  MANUFACTURING_INDUSTRY_MATERIAL = '04',
  OTHER = '05',
}

export const MATERIAL_TYPE_DESCRIPTIONS = {
  [MaterialTypeEnum.RAW_MATERIAL]: 'Materia prima',
  [MaterialTypeEnum.PROCESSED_MATERIAL]: 'Materia procesada',
  [MaterialTypeEnum.FINISHED_MATERIAL]:
    'Materia terminada (producto terminado)',
  [MaterialTypeEnum.MANUFACTURING_INDUSTRY_MATERIAL]:
    'Materia para la industria manufacturera',
  [MaterialTypeEnum.OTHER]: 'Otra',
};

export enum TypeOfCustomsDocumentEnum {
  PEDIMENT = '01',
  TEMPORARY_IMPORT_AUTHORIZATION = '02',
  TEMPORARY_IMPORT_AUTHORIZATION_VESSELS = '03',
  TEMPORARY_IMPORT_AUTHORIZATION_MAINTENANCE = '04',
  IMPORT_AUTHORIZATION_SPECIAL_VEHICLES = '05',
  TEMPORARY_EXPORT_NOTICE = '06',
  TRANSFER_NOTICE_IMMEX_RFE_AUTHORIZED_OPERATOR = '07',
  TRANSFER_NOTICE_AUTO_PARTS_BORDER_ZONE = '08',
  TEMPORARY_IMPORT_CONSTANCY_CONTAINERS = '09',
  MERCHANDISE_TRANSFER_CONSTANCY = '10',
  DONATION_AUTHORIZATION_FOREIGN_MERCHANDISE = '11',
  ATA_CARNET = '12',
  EXCHANGE_LISTS = '13',
  TEMPORARY_IMPORT_PERMIT = '14',
  TEMPORARY_IMPORT_PERMIT_RV = '15',
  TEMPORARY_IMPORT_PERMIT_VESSELS = '16',
  DONATION_REQUEST_EMERGENCIES_DISASTERS = '17',
  CONSOLIDATED_NOTICE = '18',
  CROSSING_NOTICE_MERCHANDISE = '19',
  OTHER = '20',
}

export const TYPE_OF_CUSTOMS_DOCUMENT_DESCRIPTIONS = {
  [TypeOfCustomsDocumentEnum.PEDIMENT]: 'Pedimento',
  [TypeOfCustomsDocumentEnum.TEMPORARY_IMPORT_AUTHORIZATION]:
    'Autorización de importación temporal',
  [TypeOfCustomsDocumentEnum.TEMPORARY_IMPORT_AUTHORIZATION_VESSELS]:
    'Autorización de importación temporal de embarcaciones',
  [TypeOfCustomsDocumentEnum.TEMPORARY_IMPORT_AUTHORIZATION_MAINTENANCE]:
    'Autorización de importación temporal de mercancías, destinadas al mantenimiento y reparación de las mercancías importadas temporalmente',
  [TypeOfCustomsDocumentEnum.IMPORT_AUTHORIZATION_SPECIAL_VEHICLES]:
    'Autorización para la importación de vehículos especialmente construidos o transformados, equipados con dispositivos o aparatos diversos para cumplir con contrato derivado de licitación pública',
  [TypeOfCustomsDocumentEnum.TEMPORARY_EXPORT_NOTICE]:
    'Aviso de exportación temporal',
  [TypeOfCustomsDocumentEnum.TRANSFER_NOTICE_IMMEX_RFE_AUTHORIZED_OPERATOR]:
    'Aviso de traslado de mercancías de empresas con Programa IMMEX, RFE u Operador Económico Autorizado',
  [TypeOfCustomsDocumentEnum.TRANSFER_NOTICE_AUTO_PARTS_BORDER_ZONE]:
    'Aviso para el traslado de autopartes ubicadas en la franja o región fronteriza a la industria terminal automotriz o manufacturera de vehículos de autotransporte en el resto del territorio nacional',
  [TypeOfCustomsDocumentEnum.TEMPORARY_IMPORT_CONSTANCY_CONTAINERS]:
    'Constancia de importación temporal, retorno o transferencia de contenedores',
  [TypeOfCustomsDocumentEnum.MERCHANDISE_TRANSFER_CONSTANCY]:
    'Constancia de transferencia de mercancías',
  [TypeOfCustomsDocumentEnum.DONATION_AUTHORIZATION_FOREIGN_MERCHANDISE]:
    'Autorización de donación de mercancías al Fisco Federal que se encuentren en el extranjero',
  [TypeOfCustomsDocumentEnum.ATA_CARNET]: 'Cuaderno ATA',
  [TypeOfCustomsDocumentEnum.EXCHANGE_LISTS]: 'Listas de intercambio',
  [TypeOfCustomsDocumentEnum.TEMPORARY_IMPORT_PERMIT]:
    'Permiso de Importación Temporal',
  [TypeOfCustomsDocumentEnum.TEMPORARY_IMPORT_PERMIT_RV]:
    'Permiso de importación temporal de casa rodante',
  [TypeOfCustomsDocumentEnum.TEMPORARY_IMPORT_PERMIT_VESSELS]:
    'Permiso de importación temporal de embarcaciones',
  [TypeOfCustomsDocumentEnum.DONATION_REQUEST_EMERGENCIES_DISASTERS]:
    'Solicitud de donación de mercancías en casos de emergencias o desastres naturales',
  [TypeOfCustomsDocumentEnum.CONSOLIDATED_NOTICE]: 'Aviso de consolidado',
  [TypeOfCustomsDocumentEnum.CROSSING_NOTICE_MERCHANDISE]:
    'Aviso de cruce de mercancias',
  [TypeOfCustomsDocumentEnum.OTHER]: 'Otro',
};

export enum TransportTypeEnum {
  UNIT_TRUCK = 'PT01',
  TRUCK = 'PT02',
  TRACTOR_TRUCK = 'PT03',
  TRAILER = 'PT04',
  SEMI_TRAILER = 'PT05',
  LIGHT_LOAD_VEHICLE = 'PT06',
  CRANE = 'PT07',
  AIRCRAFT = 'PT08',
  SHIP_OR_VESSEL = 'PT09',
  CAR_OR_WAGON = 'PT10',
  CONTAINER = 'PT11',
  LOCOMOTIVE = 'PT12',
}

export const TRANSPORT_TYPE_DESCRIPTIONS = {
  [TransportTypeEnum.UNIT_TRUCK]: 'Camión unitario',
  [TransportTypeEnum.TRUCK]: 'Camión',
  [TransportTypeEnum.TRACTOR_TRUCK]: 'Tractocamión',
  [TransportTypeEnum.TRAILER]: 'Remolque',
  [TransportTypeEnum.SEMI_TRAILER]: 'Semirremolque',
  [TransportTypeEnum.LIGHT_LOAD_VEHICLE]: 'Vehículo ligero de carga',
  [TransportTypeEnum.CRANE]: 'Grúa',
  [TransportTypeEnum.AIRCRAFT]: 'Aeronave',
  [TransportTypeEnum.SHIP_OR_VESSEL]: 'Barco o buque',
  [TransportTypeEnum.CAR_OR_WAGON]: 'Carro o vagón',
  [TransportTypeEnum.CONTAINER]: 'Contenedor',
  [TransportTypeEnum.LOCOMOTIVE]: 'Locomotora',
};

export enum TransportFigureEnum {
  OPERATOR = '01',
  OWNER = '02',
  LESSOR = '03',
  NOTIFIED = '04',
  COORDINATED_MEMBER = '05',
}

export const TRANSPORT_FIGURE_DESCRIPTIONS = {
  [TransportFigureEnum.OPERATOR]: 'Operador',
  [TransportFigureEnum.OWNER]: 'Propietario',
  [TransportFigureEnum.LESSOR]: 'Arrendador',
  [TransportFigureEnum.NOTIFIED]: 'Notificado',
  [TransportFigureEnum.COORDINATED_MEMBER]: 'Integrante de Coordinados',
};

export enum RegistroIstmoEnum {
  COATZACOALCOS_I = '01',
  COATZACOALCOS_II = '02',
  TEXISTEPEC = '03',
  SAN_JUAN_EVANGELISTA = '04',
  SALINA_CRUZ = '05',
  SAN_BLAS_ATEMPA = '06',
}

export const REGISTRO_ISTMO_DESCRIPTIONS = {
  [RegistroIstmoEnum.COATZACOALCOS_I]: 'Coatzacoalcos I',
  [RegistroIstmoEnum.COATZACOALCOS_II]: 'Coatzacoalcos II',
  [RegistroIstmoEnum.TEXISTEPEC]: 'Texistepec',
  [RegistroIstmoEnum.SAN_JUAN_EVANGELISTA]: 'San Juan Evangelista',
  [RegistroIstmoEnum.SALINA_CRUZ]: 'Salina Cruz',
  [RegistroIstmoEnum.SAN_BLAS_ATEMPA]: 'San Blas Atempa',
};

export enum LoadingKey {
  GENERAL_LOOSE_CARGO = 'CGS',
  GENERAL_CONTAINERIZED_CARGO = 'CGC',
  BULK_MINERAL = 'GMN',
  AGRICULTURAL_BULK = 'GAG',
  OTHER_FLUIDS = 'OFL',
  OIL_AND_DERIVATIVES = 'PYD',
}

export const LOADING_KEY_DESCRIPTIONS = {
  [LoadingKey.GENERAL_LOOSE_CARGO]: 'Carga General Suelta',
  [LoadingKey.GENERAL_CONTAINERIZED_CARGO]: 'Carga General Contenerizada',
  [LoadingKey.BULK_MINERAL]: 'Gran Mineral',
  [LoadingKey.AGRICULTURAL_BULK]: 'Granel Agrícola',
  [LoadingKey.OTHER_FLUIDS]: 'Otros Fluidos',
  [LoadingKey.OIL_AND_DERIVATIVES]: 'Petróleo y Derivados',
};

export enum ConfigMaritimaEnum {
  SUPPLIER = 'B01',
  BARGE = 'B02',
  BULK_CARRIER = 'B03',
  CONTAINER_SHIP = 'B04',
  DREDGER = 'B05',
  FISHING = 'B06',
  GENERAL_CARGO = 'B07',
  CHEMICAL_TANKER = 'B08',
  FERRY = 'B09',
  RO_RO = 'B10',
  RESEARCH = 'B11',
  TANKER = 'B12',
  GAS_CARRIER = 'B13',
  TUG = 'B14',
  EXTRAORDINARY_SPECIALIZATION = 'B15',
}

export const CONFIG_MARITIMA_DESCRIPTIONS = {
  [ConfigMaritimaEnum.SUPPLIER]: 'Abastecedor',
  [ConfigMaritimaEnum.BARGE]: 'Barcaza',
  [ConfigMaritimaEnum.BULK_CARRIER]: 'Granelero',
  [ConfigMaritimaEnum.CONTAINER_SHIP]: 'Porta Contenedor',
  [ConfigMaritimaEnum.DREDGER]: 'Draga',
  [ConfigMaritimaEnum.FISHING]: 'Pesquero',
  [ConfigMaritimaEnum.GENERAL_CARGO]: 'Carga General',
  [ConfigMaritimaEnum.CHEMICAL_TANKER]: 'Quimiqueros',
  [ConfigMaritimaEnum.FERRY]: 'Transbordadores',
  [ConfigMaritimaEnum.RO_RO]: 'Carga RoRo',
  [ConfigMaritimaEnum.RESEARCH]: 'Investigación',
  [ConfigMaritimaEnum.TANKER]: 'Tanquero',
  [ConfigMaritimaEnum.GAS_CARRIER]: 'Gasero',
  [ConfigMaritimaEnum.TUG]: 'Remolcador',
  [ConfigMaritimaEnum.EXTRAORDINARY_SPECIALIZATION]:
    'Extraordinaria especialización',
};

export enum RailTrafficTypeEnum {
  LOCAL_TRAFFIC = 'TT01',
  INTERLINE_FORWARDED_TRAFFIC = 'TT02',
  INTERLINE_RECEIVED_TRAFFIC = 'TT03',
  INTERLINE_TRANSIT_TRAFFIC = 'TT04',
}

export const RAIL_TRAFFIC_TYPE_DESCRIPTIONS = {
  [RailTrafficTypeEnum.LOCAL_TRAFFIC]: 'Tráfico local',
  [RailTrafficTypeEnum.INTERLINE_FORWARDED_TRAFFIC]:
    'Tráfico interlineal remitido',
  [RailTrafficTypeEnum.INTERLINE_RECEIVED_TRAFFIC]:
    'Tráfico interlineal recibido',
  [RailTrafficTypeEnum.INTERLINE_TRANSIT_TRAFFIC]:
    'Tráfico interlineal en tránsito',
};

export enum ContainerTypeEnum {
  CONTAINER_20FT = 'TC01',
  CONTAINER_40FT = 'TC02',
  CONTAINER_45FT = 'TC03',
  CONTAINER_48FT = 'TC04',
  CONTAINER_53FT = 'TC05',
}

export const CONTAINER_TYPE_DESCRIPTIONS = {
  [ContainerTypeEnum.CONTAINER_20FT]: 'Contenedor de 6.1 Mts de longitud',
  [ContainerTypeEnum.CONTAINER_40FT]: 'Contenedor de 12.2 Mts de longitud',
  [ContainerTypeEnum.CONTAINER_45FT]: 'Contenedor de 13.7 Mts de longitud',
  [ContainerTypeEnum.CONTAINER_48FT]: 'Contenedor de 14.6 Mts de longitud',
  [ContainerTypeEnum.CONTAINER_53FT]: 'Contenedor de 16.1 Mts de longitud',
};

export enum MaritimeContainerTypeEnum {
  REFRIGERATED_20FT = 'CM001',
  REFRIGERATED_40FT = 'CM002',
  STANDARD_8FT = 'CM003',
  STANDARD_10FT = 'CM004',
  STANDARD_20FT = 'CM005',
  STANDARD_40FT = 'CM006',
  OPEN_SIDE = 'CM007',
  ISOTANK = 'CM008',
  FLAT_RACKS = 'CM009',
  TANKER_SHIP = 'CM010',
  FERRY = 'CM011',
  TOURIST_FERRY = 'CM012',
}

export const MARITIME_CONTAINER_TYPE_DESCRIPTIONS = {
  [MaritimeContainerTypeEnum.REFRIGERATED_20FT]:
    'Contenedores refrigerados de 20FT',
  [MaritimeContainerTypeEnum.REFRIGERATED_40FT]:
    'Contenedores refrigerados de 40FT',
  [MaritimeContainerTypeEnum.STANDARD_8FT]: 'Contenedores estándar de 8FT',
  [MaritimeContainerTypeEnum.STANDARD_10FT]: 'Contenedores estándar de 10FT',
  [MaritimeContainerTypeEnum.STANDARD_20FT]: 'Contenedores estándar de 20FT',
  [MaritimeContainerTypeEnum.STANDARD_40FT]: 'Contenedores estándar de 40FT',
  [MaritimeContainerTypeEnum.OPEN_SIDE]: 'Contenedores Open Side',
  [MaritimeContainerTypeEnum.ISOTANK]: 'Contenedor Isotanque',
  [MaritimeContainerTypeEnum.FLAT_RACKS]: 'Contenedor flat racks',
  [MaritimeContainerTypeEnum.TANKER_SHIP]: 'Buque tanque',
  [MaritimeContainerTypeEnum.FERRY]: 'Ferri',
  [MaritimeContainerTypeEnum.TOURIST_FERRY]: 'Ferri – Turístico y vacíos',
};

export enum RailCarTypeEnum {
  BOXCAR = 'TC01',
  GONDOLA = 'TC02',
  HOPPER = 'TC03',
  TANK = 'TC04',
  INTERMODAL_PLATFORM = 'TC05',
  GENERAL_PURPOSE_PLATFORM = 'TC06',
  AUTOMOTIVE_PLATFORM = 'TC07',
  LOCOMOTIVE = 'TC08',
  SPECIAL_CAR = 'TC09',
  PASSENGER = 'TC10',
  TRACK_MAINTENANCE = 'TC11',
}

export const RAIL_CAR_TYPE_DESCRIPTIONS = {
  [RailCarTypeEnum.BOXCAR]: 'Furgón',
  [RailCarTypeEnum.GONDOLA]: 'Góndola',
  [RailCarTypeEnum.HOPPER]: 'Tolva',
  [RailCarTypeEnum.TANK]: 'Tanque',
  [RailCarTypeEnum.INTERMODAL_PLATFORM]: 'Plataforma Intermodal',
  [RailCarTypeEnum.GENERAL_PURPOSE_PLATFORM]: 'Plataforma de Uso General',
  [RailCarTypeEnum.AUTOMOTIVE_PLATFORM]: 'Plataforma Automotriz',
  [RailCarTypeEnum.LOCOMOTIVE]: 'Locomotora',
  [RailCarTypeEnum.SPECIAL_CAR]: 'Carro Especial',
  [RailCarTypeEnum.PASSENGER]: 'Pasajeros',
  [RailCarTypeEnum.TRACK_MAINTENANCE]: 'Mantenimiento de Vía',
};

export enum RailServiceTypeEnum {
  RAILWAY_CARS = 'TS01',
  INTERMODAL_RAILWAY_CARS = 'TS02',
  UNIT_TRAIN_RAILWAY_CARS = 'TS03',
  UNIT_TRAIN_INTERMODAL = 'TS04',
}

export enum MotivoTrasladoEnum {
  PRIORLY_INVOICED_GOODS_SHIPMENT = '01',
  RELOCATION_OF_OWN_GOODS = '02',
  CONSIGNMENT_CONTRACT_GOODS_SHIPMENT = '03',
  GOODS_SHIPMENT_FOR_SUBSEQUENT_SALE = '04',
  THIRD_PARTY_OWNED_GOODS_SHIPMENT = '05',
  OTHER = '99',
}

export const MOTIVO_TRASLADO_DESCRIPTION = {
  [MotivoTrasladoEnum.PRIORLY_INVOICED_GOODS_SHIPMENT]:
    'Envío de mercancías facturadas con anterioridad',
  [MotivoTrasladoEnum.RELOCATION_OF_OWN_GOODS]:
    'Reubicación de mercancías propias',
  [MotivoTrasladoEnum.CONSIGNMENT_CONTRACT_GOODS_SHIPMENT]:
    'Envío de mercancías objeto de contrato de consignación',
  [MotivoTrasladoEnum.GOODS_SHIPMENT_FOR_SUBSEQUENT_SALE]:
    'Envío de mercancías para posterior enajenación',
  [MotivoTrasladoEnum.THIRD_PARTY_OWNED_GOODS_SHIPMENT]:
    'Envío de mercancías propiedad de terceros',
  [MotivoTrasladoEnum.OTHER]: 'Otros',
};

export enum TaxType {
  IVA = 'IVA',
  IEPS = 'IEPS',
  ISR = 'ISR',
}

export enum TaxFactor {
  RATE = 'Tasa',
  QUOTA = 'Cuota',
  EXENTO = 'Exento',
}

export enum IepsMode {
  SUM_BEFORE_TAXES = 'sum_before_taxes',
  UNIT = 'unit',
  BREAK_DOWN = 'break_down',
  SUBTRACT_BEFORE_BREAKDOWN = 'subtract_before_break_down',
}

export enum PaymentMethod {
  PAGO_EN_UNA_EXHIBICION = 'PUE',
  PAGO_EN_PARCIALIDADES_DIFERIDO = 'PPD',
}

export enum InvoiceUse {
  ADQUISICION_MERCANCIAS = 'G01',
  DEVOLUCIONES_DESCUENTOS_BONIFICACIONES = 'G02',
  GASTOS_EN_GENERAL = 'G03',
  CONSTRUCCIONES = 'I01',
  MOBILIARIO_Y_EQUIPO_DE_OFICINA = 'I02',
  EQUIPO_DE_TRANSPORTE = 'I03',
  EQUIPO_DE_COMPUTO = 'I04',
  DADOS_TROQUELES_HERRAMENTAL = 'I05',
  COMUNICACIONES_TELEFONICAS = 'I06',
  COMUNICACIONES_SATELITALES = 'I07',
  OTRA_MAQUINARIA = 'I08',
  HONORARIOS_MEDICOS = 'D01',
  GASTOS_MEDICOS_POR_INCAPACIDAD = 'D02',
  GASTOS_FUNERALES = 'D03',
  DONATIVOS = 'D04',
  INTERESES_POR_CREDITOS_HIPOTECARIOS = 'D05',
  APORTACIONES_VOLUNTARIAS_SAR = 'D06',
  PRIMA_SEGUROS_GASTOS_MEDICOS = 'D07',
  GASTOS_TRANSPORTACION_ESCOLAR = 'D08',
  CUENTAS_AHORRO_PENSIONES = 'D09',
  SERVICIOS_EDUCATIVOS = 'D10',
  SIN_EFECTOS_FISCALES = 'S01',
  PAGOS = 'CP01',
  NOMINA = 'CN01',
  POR_DEFINIR = 'P01',
}

export enum InvoiceType {
  INGRESO = 'I',
  EGRESO = 'E',
  TRASLADO = 'T',
  NOMINA = 'N',
  PAGO = 'P',
}

export enum InvoiceRelation {
  NOTA_DE_CREDITO = '01',
  NOTA_DE_DEBITO = '02',
  DELOVUCION_DE_MERCANCIA = '03',
  SUSTITUCION_DE_CFDI_PREVIOS = '04',
  TRASLADOS_DE_MERCANCIA_FACTURADOS_PREVIAMENTE = '05',
  FACTURA_POR_TRASLADOS_PREVIOS = '06',
  APLICACION_DE_ANTICIPO = '07',
}

export enum TaxSystem {
  GENERAL_LEY_DE_PERSONAS_MORALES = '601',
  PERSONAS_MORALES_CON_FINES_NO_LUCRATIVOS = '603',
  SUELDOS_Y_SALARIOS = '605',
  ARRENDAMIENTO = '606',
  REGIMEN_DE_ENAJENACION_O_ADQUISICION_DE_BIENES = '607',
  DEMAS_INGRESOS = '608',
  RESIDENTES_EN_EL_EXTRANJERO_SIN_ESTABLECIMIENTO_PERMANENTE_EN_MÉXICO = '610',
  RESIDENTES_EN_EL_EXTRANJERO = '610',
  INGRESOS_POR_DIVIDENDOS_SOCIOS_Y_ACCIONISTAS = '611',
  PERSONAS_FISICAS_CON_ACTIVIDADES_EMPRESARIALES_Y_PROFESIONALES = '612',
  INGRESOS_POR_INTERESES = '614',
  REGIMEN_DE_LOS_INGRESOS_POR_OBTENCION_DE_PREMIOS = '615',
  SIN_OBLIGACIONES_FISCALES = '616',
  SOCIEDADES_COOPERATIVAS_DE_PRODUCCION = '620',
  REGIMEN_DE_INCORPORACION_FISCAL = '621',
  ACTIVIDADES_AGRICOLAS_GANADERAS_SILVICOLAS_Y_PESQUERAS = '622',
  OPCIONAL_PARA_GRUPOS_DE_SOCIEDADES = '623',
  COORDINADOS = '624',
  ACTIVIDADES_EMPRESARIALES_CON_INGRESOS_A_TRAVÉS_DE_PLATAFORMAS_TECNOLÓGICAS = '625',
  RÉGIMEN_SIMPLIFICADO_DE_CONFIANZA = '626',
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  VALID = 'valid',
  CANCELED = 'canceled',
  FAILED = 'failed',
}

export enum GlobalInvoicePeriodicity {
  DAY = 'day',
  WEEK = 'week',
  FORTNIGHT = 'fortnight',
  MONTH = 'month',
  TWO_MONTHS = 'two_months',
}

export enum ReceiptStatus {
  OPEN = 'open',
  CANCELED = 'canceled',
  INVOICED_TO_CUSTOMER = 'invoiced_to_customer',
  INVOICED_GLOBALLY = 'invoiced_globally',
}

export enum IssuingType {
  ISSUING = 'issuing',
  RECEIVING = 'receiving',
}

export enum CancellationStatus {
  NONE = 'none',
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  VERIFYING = 'verifying',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum InvoicingPeriod {
  DAY = 'day',
  WEEK = 'week',
  FORTNIGHT = 'fortnight',
  MONTH = 'month',
  TWO_MONTHS = 'two_months',
}

export enum InvoiceComplementType {
  CUSTOM = 'custom',
  PAGO = 'pago',
  NOMINA = 'nomina',
}

export enum CancellationMotive {
  ERRORES_CON_RELACION = '01',
  ERRORES_SIN_RELACION = '02',
  NO_SE_CONCRETO = '03',
  FACTURA_GLOBAL = '04',
}
