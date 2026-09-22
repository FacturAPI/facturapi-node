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

export interface FacturapiErrorDetail {
  code?: string;
  message?: string;
  path?: string;
  location?: string;
  source?: string;
  [key: string]: unknown;
}

export interface FacturapiErrorOptions {
  message: string;
  status: number;
  code?: string;
  path?: string;
  location?: string;
  errors?: FacturapiErrorDetail[];
  logId?: string;
  headers?: Record<string, string>;
}

export class FacturapiError extends Error {
  status: number;
  code?: string;
  path?: string;
  location?: string;
  errors?: FacturapiErrorDetail[];
  logId?: string;
  headers: Record<string, string>;

  constructor(options: FacturapiErrorOptions) {
    super(options.message);
    this.name = 'FacturapiError';
    this.status = options.status;
    this.code = options.code;
    this.path = options.path;
    this.location = options.location;
    this.errors = options.errors;
    this.logId = options.logId;
    this.headers = options.headers || {};
  }
}

const responseHeadersToObject = (headers: Headers): Record<string, string> => {
  const result: Record<string, string> = {};
  if (typeof headers.forEach === 'function') {
    headers.forEach((value, key) => {
      result[key.toLowerCase()] = value;
    });
    return result;
  }
  for (const key of ['retry-after', 'x-facturapi-log-id']) {
    const value = headers.get(key);
    if (value) {
      result[key] = value;
    }
  }
  return result;
};

const isPlainRecord = (value: object): boolean => {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/**
 * Flattens a params object into `[key, value]` pairs suitable for
 * `URLSearchParams`. Plain objects expand to the bracket notation the API
 * documents (`date[gte]=...`, the `deepObject` style) and arrays expand to
 * repeated keys (`status=a&status=b`, the OpenAPI default `form` + `explode`),
 * so every official SDK sends the same encoding. `null` and `undefined` values
 * and empty collections are skipped, mirroring how query params were
 * serialized before the Fetch API migration. Other object values (`URL`,
 * `RegExp`, custom instances) keep their previous string conversion.
 */
const buildQueryString = (params: Record<string, unknown>): string => {
  const pairs: Array<[string, string]> = [];
  const append = (value: unknown, key: string) => {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return;
      }
      for (const item of value) {
        append(item, key);
      }
      return;
    }
    if (typeof value === 'object') {
      if (value instanceof Date) {
        pairs.push([key, value.toISOString()]);
        return;
      }
      if (isPlainRecord(value)) {
        const entries = Object.entries(value);
        if (entries.length === 0) {
          return;
        }
        for (const [subKey, subValue] of entries) {
          append(subValue, `${key}[${subKey}]`);
        }
        return;
      }
    }
    pairs.push([key, String(value)]);
  };
  for (const [key, value] of Object.entries(params)) {
    append(value, key);
  }
  return pairs.length ? new URLSearchParams(pairs).toString() : '';
};


const stringFrom = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const statusFrom = (value: unknown, fallback: number): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

const responseDateFields = new Set([
  'created_at',
  'date',
  'edit_link_expires_at',
  'expires_at',
  'fecha_exp',
  'last_checked',
  'requested_at',
  'sat_validated_at',
  'scheduled_for',
  'updated_at',
]);

// Only hydrate ISO dates; unrelated free-form strings may share these keys.
const isoDatePattern = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/;

const deserializeResponseDates = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(deserializeResponseDates);
  }
  if (!value || typeof value !== 'object' || !isPlainRecord(value)) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      if (key === 'metadata') {
        return [key, nestedValue];
      }
      if (
        responseDateFields.has(key) &&
        typeof nestedValue === 'string' &&
        isoDatePattern.test(nestedValue)
      ) {
        const date = new Date(nestedValue);
        if (!Number.isNaN(date.getTime())) {
          return [key, date];
        }
      }
      return [key, deserializeResponseDates(nestedValue)];
    }),
  );
};

const responseInterceptor = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let bodyText: string | null = null;
    try {
      bodyText = await response.text();
    } catch {
      bodyText = null;
    }

    let errorData: Record<string, unknown> | null = null;
    let jsonMessage: string | null = null;
    if (contentType.includes('application/json') && bodyText) {
      try {
        errorData = JSON.parse(bodyText) as Record<string, unknown>;
        if (typeof errorData.message === 'string' && errorData.message.trim()) {
          jsonMessage = errorData.message;
        }
      } catch {
        // non-JSON body; fall through to body/status error
      }
    }

    const headers = responseHeadersToObject(response.headers);
    throw new FacturapiError({
      message: jsonMessage || bodyText || response.statusText,
      status: statusFrom(errorData?.status, response.status),
      code: stringFrom(errorData?.code),
      path: stringFrom(errorData?.path),
      location: stringFrom(errorData?.location),
      errors: Array.isArray(errorData?.errors)
        ? (errorData.errors as FacturapiErrorDetail[])
        : undefined,
      logId: headers['x-facturapi-log-id'],
      headers,
    });
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
    return deserializeResponseDates(await response.json());
  }
  return response.text();
};

export const createWrapper = (
  apiKey: string,
  apiVersion: 'v1' | 'v2' = DEFAULT_API_VERSION,
  headers: Record<string, string> = {},
) => {
  let baseURL = apiVersion === 'v1' ? BASE_URL_V1 : BASE_URL;
  const defaultHeaders = new Headers(headers);
  defaultHeaders.delete('Authorization');
  defaultHeaders.delete('Content-Type');
  defaultHeaders.set('Authorization', `Bearer ${apiKey}`);

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
      const serializedQuery = params ? buildQueryString(params) : '';
      const queryString = serializedQuery ? `?${serializedQuery}` : '';
      const requestHeaders = new Headers(defaultHeaders);
      if (!formData) {
        requestHeaders.set('Content-Type', 'application/json');
      }
      const fetchOptions: RequestInit = {
        ...restOptions,
        headers: requestHeaders,
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
