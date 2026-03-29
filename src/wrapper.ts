import {
  BASE_URL,
  BASE_URL_V1,
  DEFAULT_API_VERSION,
} from './constants';

const getRuntimeFetch = () => {
  const runtimeFetch = globalThis.fetch;
  if (!runtimeFetch) {
    throw new Error(
      'Fetch API is not available in this runtime. Use Node.js 18+ or provide a global fetch implementation.',
    );
  }
  return runtimeFetch.bind(globalThis);
};

function hasBuffer(): boolean {
  return typeof Buffer !== 'undefined';
}

function hasBtoa(): boolean {
  return typeof globalThis.btoa === 'function';
}

export type UniversalFormData = FormData | InstanceType<any>;

const responseInterceptor = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    try {
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error(response.statusText);
    }
  }
  const contentType = response.headers.get('content-type');
  if (contentType) {
    if (
      contentType.includes('image/') ||
      contentType.includes('application/pdf') ||
      contentType.includes('application/xml') ||
      contentType.includes('application/zip')
    ) {
      if (hasBuffer()) {
        const reader = response.body?.getReader();
        if (!reader) {
          return response.blob();
        }
        try {
          const { Readable } = await import('stream');
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
        } catch (e) {
          return response.blob();
        }
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
  if (hasBuffer()) {
    return Buffer.from(text, 'utf8').toString('base64');
  }
  if (hasBtoa()) {
    return globalThis.btoa(text);
  }
  throw new Error(
    'No base64 encoder available in this runtime. Provide Buffer or btoa.',
  );
}

export const createWrapper = (
  apiKey: string,
  apiVersion: 'v1' | 'v2' = DEFAULT_API_VERSION,
) => {
  let baseURL = apiVersion === 'v1' ? BASE_URL_V1 : BASE_URL;
  const defaultHeaders = {
    Authorization: `Basic ${encodeStringToBase64(apiKey + ':')}`,
  };

  const client = {
    get baseURL(): string {
      return baseURL;
    },
    set baseURL(url: string) {
      baseURL = url;
    },
    async request(
      url: string,
      options?: {
        params?: Record<string, any> | null;
        body?: any;
        formData?: FormData;
        method?: string;
      },
    ) {
      const { params, body, formData, ...restOptions } = options || {};
      const queryString = params
        ? '?' + new URLSearchParams(params).toString()
        : '';
      const fetchOptions: RequestInit = {
        ...restOptions,
        headers: {
          ...defaultHeaders,
          ...(formData ? {} : { 'Content-Type': 'application/json' }),
        },
        body: formData
          ? (formData as BodyInit)
          : body
            ? JSON.stringify(body)
            : undefined,
      };
      const response = await getRuntimeFetch()(
        baseURL + url + queryString,
        fetchOptions,
      );
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
