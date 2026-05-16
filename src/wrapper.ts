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

type FormDataLike = {
  append: (name: string, value: unknown, fileName?: string) => void;
};

export type UniversalFormData = FormData | FormDataLike;

const responseInterceptor = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let bodyText: string | null = null;
    try {
      bodyText = await response.text();
    } catch {
      bodyText = null;
    }

    let jsonMessage: string | null = null;
    if (contentType.includes('application/json') && bodyText) {
      try {
        const errorData = JSON.parse(bodyText) as { message?: unknown };
        if (typeof errorData.message === 'string' && errorData.message.trim()) {
          jsonMessage = errorData.message;
        }
      } catch {
        // non-JSON body; fall through to body/status error
      }
    }

    throw new Error(jsonMessage || bodyText || response.statusText);
  }
  const contentType = response.headers.get('content-type') || '';
  const contentDisposition =
    response.headers.get('content-disposition') || '';
  const looksLikeZip = /filename=.*\.zip\b/i.test(contentDisposition);
  const looksLikeDownload =
    /attachment/i.test(contentDisposition) || looksLikeZip;
  const isBinaryContentType =
    contentType.includes('image/') ||
    contentType.includes('application/pdf') ||
    contentType.includes('application/xml') ||
    contentType.includes('application/zip') ||
    contentType.includes('application/octet-stream');

  if (isBinaryContentType || !contentType || looksLikeDownload) {
    if (hasBuffer()) {
      const reader = response.body?.getReader();
      if (!reader) {
        return response.blob();
      }
      try {
        const { Readable } = await import('stream');
        return new Readable({
          read() {
            reader.read()
              .then(({ done, value }) => {
                if (done) {
                  this.push(null); // end stream
                } else {
                  this.push(Buffer.from(value)); // push data to stream
                }
              })
              .catch((error: unknown) => {
                void reader.cancel(error).catch(() => undefined);
                this.destroy(
                  error instanceof Error
                    ? error
                    : new Error('Failed to read binary response stream'),
                );
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
  return response.text();
};

export const createWrapper = (
  apiKey: string,
  apiVersion: 'v1' | 'v2' = DEFAULT_API_VERSION,
  headers: Record<string, string> = {},
) => {
  let baseURL = apiVersion === 'v1' ? BASE_URL_V1 : BASE_URL;
  const defaultHeaders = {
    ...headers,
    Authorization: `Bearer ${apiKey}`,
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
        formData?: UniversalFormData;
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
