export const BASE_URL = 'https://www.facturapi.io/v2';
export const BASE_URL_V1 = 'https://www.facturapi.io/v1';
export const DEFAULT_API_VERSION = 'v2';

export const isNode =
  typeof process !== 'undefined' && Boolean(process?.versions?.node);
export const isReactNative =
  typeof navigator !== 'undefined' && navigator?.product === 'ReactNative';
