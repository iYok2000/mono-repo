import type { AxiosResponse } from 'axios';

export const responseInterceptor = (response: AxiosResponse) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
  }

  return response;
};

export const responseErrorInterceptor = (error: unknown) => {
  // Network error or no response
  if (!error || typeof error !== 'object' || !('response' in error)) {
    if (process.env.NODE_ENV === 'development') {
      const err = error as { message?: string; config?: { url?: string }; code?: string };
      console.error('❌ Network Error:', {
        message: err.message,
        url: err.config?.url,
        code: err.code,
      });
    }
    return Promise.reject(error);
  }

  // HTTP error with response
  const axiosError = error as { response: { status: number; data: unknown }; config?: { url?: string } };
  const { status, data } = axiosError.response;

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Response Error:', {
      status,
      url: axiosError.config?.url,
      data,
    });
  }

  if (status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/admin/auth/login';
    }
  }

  if (status === 403) {
    console.error('Access denied');
  }

  if (status >= 500) {
    console.error('Server error:', data);
  }

  return Promise.reject(error);
};
