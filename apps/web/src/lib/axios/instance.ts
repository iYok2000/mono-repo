import axios from 'axios';
import { API_CONFIG } from './config';
import {
  requestInterceptor,
  requestErrorInterceptor,
} from './interceptors/request';
import {
  responseInterceptor,
  responseErrorInterceptor,
} from './interceptors/response';

export const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );

  instance.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor
  );

  return instance;
};

export const nodeApi = createAxiosInstance(API_CONFIG.NODE_API);
export const goApi = createAxiosInstance(API_CONFIG.GO_API);
export const defaultApi = nodeApi;
