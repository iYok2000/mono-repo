import axios from 'axios';
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
  // Use axios.isAxiosError for proper type narrowing
  if (!axios.isAxiosError(error)) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Unknown Error:', error);
    }
    return Promise.reject(error);
  }

  // Network error — no response from server (ECONNREFUSED, timeout, etc.)
  if (!error.response) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Network Error:', {
        message: error.message,
        url: error.config?.url,
        code: error.code,
      });
    }
    return Promise.reject(error);
  }

  // HTTP error with response
  const status = error.response?.status;
  const data = error.response?.data;
  const url = error.config?.url;

  if (process.env.NODE_ENV === 'development') {
    if (typeof status === 'number') {
      const logFn = status >= 500 ? console.error : console.warn;
      logFn(`❌ Response Error [${status}]:`, { url, data });
    } else {
      // Malformed response — log raw error for diagnosis
      console.error('❌ Response Error (malformed):', {
        url,
        responseKeys: error.response ? Object.keys(error.response) : null,
        message: error.message,
        code: error.code,
      });
    }
  }

  if (status === 401) {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin/auth/login')) {
        const errorMessage =
          typeof data === 'object' && data !== null && 'message' in (data as object)
            ? (data as { message: string }).message
            : 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่';

        const event = new CustomEvent('auth:unauthorized', {
          detail: { message: errorMessage },
        });
        window.dispatchEvent(event);

        if (process.env.NODE_ENV === 'development') {
          console.warn('🔒 Unauthorized:', errorMessage);
        }
      }
    }
  }

  if (status === 403) {
    console.error('Access denied');
  }

  if (typeof status === 'number' && status >= 500) {
    console.error('Server error:', data);
  }

  return Promise.reject(error);
};

