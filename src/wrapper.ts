import {
  BASE_URL,
  BASE_URL_V1,
  DEFAULT_API_VERSION,
  isNode,
  isReactNative,
} from './constants';
import fetch from 'cross-fetch';

let btoa: (data: string) => string;
export type NodeFormData = any;
export let NodeFormData: NodeFormData;

if (isNode) {
  btoa = (data: string) => Buffer.from(data).toString('base64');
  NodeFormData = require('form-data');
} else if (isReactNative) {
  // React Native environment
  btoa = (data: string) => globalThis.Buffer.from(data).toString('base64');
} else {
  // Browser environment
  btoa = globalThis.btoa;
}

export type UniversalFormData = FormData | InstanceType<any>;

const responseInterceptor = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || response.statusText);
  }
  const contentType = response.headers.get('content-type');
  if (contentType) {
    if (
      contentType.includes('image/') ||
      contentType.includes('application/pdf') ||
      contentType.includes('application/xml') ||
      contentType.includes('application/zip')
    ) {
      if (isNode) {
        const reader = response.body?.getReader();
        if (!reader) {
          return response.body;
        }
        const { Readable } = require('stream');
        return new Readable({
          read() {
            reader.read().then(({ done, value }) => {
              if (done) {
                this.push(null); // end stream
              } else {
                this.push(Buffer.from(value)); // push data to stream
              }
            });
          },
        });
      } else {
        return response.blob();
      }
    } else if (contentType.includes('application/json')) {
      return response.json();
    }
  }
  return response.text();
};

function encodeStringToBase64(text: string) {
  return btoa(text);
}

export const createWrapper = (
  apiKey: string,
  apiVersion: 'v1' | 'v2' = DEFAULT_API_VERSION,
) => {
  const baseURL = apiVersion === 'v1' ? BASE_URL_V1 : BASE_URL;
  const defaultHeaders = {
    Authorization: `Basic ${encodeStringToBase64(apiKey + ':')}`,
    'Content-Type': 'application/json',
  };

  const client = {
    async request(
      url: string,
      options?: {
        params?: Record<string, any> | null;
        body?: any;
        formData?: UniversalFormData;
        method?: string;
      },
    ) {
      const { params, body, formData, ...restOptions } = options || {};
      const queryString = params
        ? '?' + new URLSearchParams(params).toString()
        : '';
      const headers =
        formData && isNode
          ? {
              ...defaultHeaders,
              ...(formData as InstanceType<NodeFormData>).getHeaders(),
            }
          : defaultHeaders;
      const fetchOptions: RequestInit = {
        ...restOptions,
        headers,
        body: formData
          ? (formData as BodyInit)
          : body
            ? JSON.stringify(body)
            : undefined,
      };
      const response = await fetch(baseURL + url + queryString, fetchOptions);
      return responseInterceptor(response);
    },
    get(url: string, options?: { params?: Record<string, any> | null }) {
      return this.request(url, { method: 'GET', ...options });
    },
    post(
      url: string,
      options?: {
        body?: any;
        formData?: UniversalFormData;
        params?: Record<string, any> | null;
      },
    ) {
      return this.request(url, { method: 'POST', ...options });
    },
    put(
      url: string,
      options?: {
        body?: any;
        formData?: UniversalFormData;
        params?: Record<string, any> | null;
      },
    ) {
      return this.request(url, { method: 'PUT', ...options });
    },
    delete(url: string, options?: { params?: Record<string, any> | null }) {
      return this.request(url, { method: 'DELETE', ...options });
    },
  };

  return client;
};

export type WrapperClient = ReturnType<typeof createWrapper>;
