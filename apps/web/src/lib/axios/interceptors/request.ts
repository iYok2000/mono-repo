import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Try to get token from sessionStorage (AuthContext stores it there)
  const token = typeof window !== 'undefined' 
    ? (sessionStorage.getItem('access_token') || localStorage.getItem('access_token'))
    : null;

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

export const requestErrorInterceptor = (error: unknown) => {
  console.error('❌ Request Error:', error);
  return Promise.reject(error);
};
