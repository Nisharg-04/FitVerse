import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

// Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const axiosApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken, user } = response.data.data;
          
          // Update tokens in store
        
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          return axiosApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const apiHelpers = {
  // Generic GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.get<T>(url, config);
    return response.data;
  },
  
  // Generic POST request
  post: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.post<T>(url, data, config);
    return response.data;
  },
  
  // Generic PUT request
  put: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.put<T>(url, data, config);
    return response.data;
  },
  
  // Generic PATCH request
  patch: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.patch<T>(url, data, config);
    return response.data;
  },
  
  // Generic DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.delete<T>(url, config);
    return response.data;
  },
  
  // File upload helper
  uploadFile: async <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosApi.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    
    return response.data;
  },
  
  // Multiple files upload helper
  uploadFiles: async <T>(url: string, files: File[], onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    const response = await axiosApi.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    
    return response.data;
  },
};

export default axiosApi;
