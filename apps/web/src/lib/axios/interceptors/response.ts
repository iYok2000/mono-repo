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

export const responseErrorInterceptor = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Response Error:', {
        status,
        url: error.config?.url,
        data,
      });
    }

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      console.error('Access denied');
    }

    if (status >= 500) {
      console.error('Server error:', data);
    }
  } else if (error.request) {
    console.error('❌ Network Error: No response received', error.request);
  } else {
    console.error('❌ Error:', error.message);
  }

  return Promise.reject(error);
};
