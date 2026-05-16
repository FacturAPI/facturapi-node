import Customers from './resources/customers';
import Products from './resources/products';
import Invoices from './resources/invoices';
import Organizations from './resources/organizations';
import Catalogs from './tools/catalogs';
import Receipts from './resources/receipts';
import Retentions from './resources/retentions';
import Webhooks from './tools/webhooks';
import Tools from './tools/tools';
import * as enums from './enums';
import { createWrapper, WrapperClient } from './wrapper';
import { DEFAULT_API_VERSION } from './constants';
import CartaPorteCatalogs from './tools/cartaPorteCatalogs';
import ComercioExteriorCatalogs from './tools/comercioExteriorCatalogs';

export * from './enums';
export * from './types';

const VALID_API_VERSIONS = ['v1', 'v2'];

export type ApiVersion = 'v1' | 'v2';

export interface FacturapiOptions {
  apiVersion?: ApiVersion;
  headers?: Record<string, string>;
}

/**
 * Get an instance of the Facturapi library
 * @class
 * @param {string} apiKey Test or Live key.
 * @returns {Facturapi} Instance of this library
 */
export default class Facturapi {
  apiVersion: ApiVersion;
  private _wrapper: WrapperClient;
  customers: Customers;
  products: Products;
  invoices: Invoices;
  organizations: Organizations;
  catalogs: Catalogs;
  cartaPorteCatalogs: CartaPorteCatalogs;
  comercioExteriorCatalogs: ComercioExteriorCatalogs;
  receipts: Receipts;
  retentions: Retentions;
  tools: Tools;
  webhooks: Webhooks;

  /**
   * Get or set the base URL used for API requests.
   * Allows overriding the default API host, e.g. for testing.
   * Usage: facturapi.BASE_URL = 'http://localhost:3000/v2'
   */
  get BASE_URL(): string {
    return this._wrapper.baseURL;
  }
  set BASE_URL(url: string) {
    this._wrapper.baseURL = url;
  }

  static get TaxType() {
    return enums.TaxType;
  }

  static get TaxFactor() {
    return enums.TaxFactor;
  }

  static get IepsMode() {
    return enums.IepsMode;
  }

  static get PaymentForm() {
    return enums.PaymentForm;
  }

  static get PaymentMethod() {
    return enums.PaymentMethod;
  }

  static get InvoiceType() {
    return enums.InvoiceType;
  }

  static get InvoiceUse() {
    return enums.InvoiceUse;
  }

  static get InvoiceRelation() {
    return enums.InvoiceRelation;
  }

  static get TaxSystem() {
    return enums.TaxSystem;
  }

  static get InvoiceStatus() {
    return enums.InvoiceStatus;
  }

  static get CancellationMotive() {
    return enums.CancellationMotive;
  }

  static get CustomsRegimes() {
    return enums.CustomsRegimes;
  }

  static get CveTransporteEnum() {
    return enums.CveTransporteEnum;
  }

  static get TipoEstacionEnum() {
    return enums.TipoEstacionEnum;
  }

  static get PermisoSctEnum() {
    return enums.PermisoSctEnum;
  }

  static get SectorCofeprisEnum() {
    return enums.SectorCofeprisEnum;
  }

  static get PharmaceuticalFormsEnum() {
    return enums.PharmaceuticalFormsEnum;
  }

  static get SpecialConditionsEnum() {
    return enums.SpecialConditionsEnum;
  }

  static get MaterialTypeEnum() {
    return enums.MaterialTypeEnum;
  }

  static get TypeOfCustomsDocumentEnum() {
    return enums.TypeOfCustomsDocumentEnum;
  }

  static get TransportTypeEnum() {
    return enums.TransportTypeEnum;
  }

  static get TransportFigureEnum() {
    return enums.TransportFigureEnum;
  }

  static get RegistroIstmoEnum() {
    return enums.RegistroIstmoEnum;
  }

  static get LoadingKey() {
    return enums.LoadingKey;
  }

  static get ConfigMaritimaEnum() {
    return enums.ConfigMaritimaEnum;
  }

  static get RailTrafficTypeEnum() {
    return enums.RailTrafficTypeEnum;
  }

  static get ContainerTypeEnum() {
    return enums.ContainerTypeEnum;
  }

  static get MaritimeContainerTypeEnum() {
    return enums.MaritimeContainerTypeEnum;
  }

  static get RailCarTypeEnum() {
    return enums.RailCarTypeEnum;
  }

  static get RailServiceTypeEnum() {
    return enums.RailServiceTypeEnum;
  }

  static get MotivoTrasladoEnum() {
    return enums.MotivoTrasladoEnum;
  }

  constructor(apiKey: string, options: FacturapiOptions = {}) {
    if (options.apiVersion) {
      if (!VALID_API_VERSIONS.includes(options.apiVersion)) {
        throw new Error(
          'Invalid API version. Valid values are: ' +
            VALID_API_VERSIONS.join(', '),
        );
      }
      this.apiVersion = options.apiVersion;
    } else {
      this.apiVersion = DEFAULT_API_VERSION;
    }
    this._wrapper = createWrapper(apiKey, this.apiVersion, options.headers);
    this.customers = new Customers(this._wrapper);
    this.products = new Products(this._wrapper);
    this.invoices = new Invoices(this._wrapper);
    this.organizations = new Organizations(this._wrapper);
    this.catalogs = new Catalogs(this._wrapper);
    this.cartaPorteCatalogs = new CartaPorteCatalogs(this._wrapper);
    this.comercioExteriorCatalogs = new ComercioExteriorCatalogs(this._wrapper);
    this.receipts = new Receipts(this._wrapper);
    this.retentions = new Retentions(this._wrapper);
    this.tools = new Tools(this._wrapper);
    this.webhooks = new Webhooks(this._wrapper);
  }
}
