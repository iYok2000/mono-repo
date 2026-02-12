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
      // Only dispatch event if not already on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin/auth/login')) {
        // Dispatch custom event for 401 error
        const errorMessage = typeof data === 'object' && data !== null && 'message' in data 
          ? (data as { message: string }).message 
          : 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่';
        
        const event = new CustomEvent('auth:unauthorized', {
          detail: { message: errorMessage }
        });
        window.dispatchEvent(event);
        
        console.warn('🔒 Unauthorized:', errorMessage);
      }
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
