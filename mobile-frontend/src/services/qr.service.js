import { apiCall } from '../utils/api.util';

// QR Token Services
export const createRentalQR = async rentalData => {
  try {
    const response = await apiCall(
      'POST',
      '/api/qr/rental/generate',
      rentalData,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to generate rental QR',
    );
  }
};

export const processRentalQR = async token => {
  try {
    const response = await apiCall('POST', '/api/qr/rental/process', { token });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to process rental QR',
    );
  }
};

export const generateReturnQR = async rentalId => {
  try {
    const response = await apiCall('POST', '/api/qr/return/generate', {
      rentalId,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to generate return QR',
    );
  }
};

export const processReturnQR = async token => {
  try {
    const response = await apiCall('POST', '/api/qr/return/process', { token });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to process return QR',
    );
  }
};

export const validateQRToken = async token => {
  try {
    const response = await apiCall('POST', '/api/qr/validate', { token });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid QR token');
  }
};
