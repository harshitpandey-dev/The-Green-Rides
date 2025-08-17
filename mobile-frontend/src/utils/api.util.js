import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:5000/api', // For Android emulator (localhost)
  // baseURL: 'http://192.168.1.XXX:5000/api', // For real device (replace with your local IP)
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor to handle common response patterns
apiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const message =
      error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  },
);

// Common API methods
export const apiUtils = {
  // GET request
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },

  // POST request
  post: (url, data, config = {}) => {
    return apiClient.post(url, data, config);
  },

  // PUT request
  put: (url, data, config = {}) => {
    return apiClient.put(url, data, config);
  },

  // DELETE request
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  // PATCH request
  patch: (url, data, config = {}) => {
    return apiClient.patch(url, data, config);
  },
};
