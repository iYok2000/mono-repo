import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';

  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
    });
  }

  return config;
};

export const requestErrorInterceptor = (error: any) => {
  console.error('❌ Request Error:', error);
  return Promise.reject(error);
};
