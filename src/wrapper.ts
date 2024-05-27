import * as constants from './constants';
import { DEFAULT_API_VERSION } from './constants';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Buffer } from 'safe-buffer';

const responseInterceptor = function (response: AxiosResponse) {
  return response;
};
const errorInterceptor = function (error: AxiosError<{ message: string }>) {
  if (error.isAxiosError) {
    return Promise.reject(new Error(error.response?.data?.message || error.message));
  } else {
    return Promise.reject(new Error(error.message));
  }
};

function encodeStringToBase64 (text: string) {
  // Make sure text is a string
  text = text.toString();
  return Buffer.from(text).toString('base64');
}

export const createWrapper = (apiKey: string, apiVersion: 'v1' | 'v2' = DEFAULT_API_VERSION): AxiosInstance => {
  const client = axios.create({
    baseURL: apiVersion === 'v1' ? constants.BASE_URL_V1 : constants.BASE_URL,
    headers: {
      Authorization: `Basic ${encodeStringToBase64(apiKey + ':')}`,
      'Content-Type': 'application/json',
    },
  });
  client.interceptors.response.use(responseInterceptor, errorInterceptor);
  return client;
}
