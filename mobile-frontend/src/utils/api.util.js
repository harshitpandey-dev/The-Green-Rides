import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:5000', // For Android emulator (localhost)
  // baseURL: 'http://192.168.1.XXX:5000', // For real device (replace with your local IP)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Helper function to get bearer token
const getBearerToken = async () => {
  try {
    const authKey = await AsyncStorage.getItem('GR_TOKEN');
    return authKey ? `Bearer ${authKey}` : null;
  } catch (error) {
    return null;
  }
};

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  async config => {
    const token = await getBearerToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common response patterns and token refresh
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('GR_REFRESH_TOKEN');
        if (refreshToken) {
          const response = await axios.post(
            `${apiClient.defaults.baseURL}/api/auth/refresh`,
            {
              refreshToken,
            },
          );

          const { token, refreshToken: newRefreshToken } = response.data;
          await AsyncStorage.setItem('GR_TOKEN', token);
          await AsyncStorage.setItem('GR_REFRESH_TOKEN', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        await AsyncStorage.multiRemove([
          'GR_TOKEN',
          'GR_REFRESH_TOKEN',
          'GR_USER',
        ]);
        // Note: Navigation to login should be handled by auth context
      }
    }

    return Promise.reject(error);
  },
);

// Main API call function
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Legacy API utilities for backward compatibility
export const apiUtils = {
  // GET request
  get: (url, config = {}) => {
    return apiCall('GET', url, null, config);
  },

  // POST request
  post: (url, data, config = {}) => {
    return apiCall('POST', url, data, config);
  },

  // PUT request
  put: (url, data, config = {}) => {
    return apiCall('PUT', url, data, config);
  },

  // DELETE request
  delete: (url, config = {}) => {
    return apiCall('DELETE', url, null, config);
  },

  // PATCH request
  patch: (url, data, config = {}) => {
    return apiCall('PATCH', url, data, config);
  },
};

// Export the axios instance for direct use if needed
export default apiClient;
