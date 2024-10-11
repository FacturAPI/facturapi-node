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
import { createWrapper } from './wrapper';
import { DEFAULT_API_VERSION } from './constants';

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
  customers: Customers;
  products: Products;
  invoices: Invoices;
  organizations: Organizations;
  catalogs: Catalogs;
  receipts: Receipts;
  retentions: Retentions;
  tools: Tools;
  webhooks: Webhooks;

  static get TaxType() {
    return enums.TaxType;
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
    const wrapper = createWrapper(apiKey, this.apiVersion);
    this.customers = new Customers(wrapper);
    this.products = new Products(wrapper);
    this.invoices = new Invoices(wrapper);
    this.organizations = new Organizations(wrapper);
    this.catalogs = new Catalogs(wrapper);
    this.receipts = new Receipts(wrapper);
    this.retentions = new Retentions(wrapper);
    this.tools = new Tools(wrapper);
    this.webhooks = new Webhooks(wrapper);
  }
}
