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

export * from './enums';
export * from './types';

const VALID_API_VERSIONS = ['v1', 'v2'];

export type ApiVersion = 'v1' | 'v2';

export interface FacturapiOptions {
  apiVersion?: ApiVersion;
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
    this._wrapper = createWrapper(apiKey, this.apiVersion);
    this.customers = new Customers(this._wrapper);
    this.products = new Products(this._wrapper);
    this.invoices = new Invoices(this._wrapper);
    this.organizations = new Organizations(this._wrapper);
    this.catalogs = new Catalogs(this._wrapper);
    this.cartaPorteCatalogs = new CartaPorteCatalogs(this._wrapper);
    this.receipts = new Receipts(this._wrapper);
    this.retentions = new Retentions(this._wrapper);
    this.tools = new Tools(this._wrapper);
    this.webhooks = new Webhooks(this._wrapper);
  }
}
