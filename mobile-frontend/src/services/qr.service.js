import { apiCall } from '../utils/api.util';

// GUARD: Create rental QR for student
export async function createRentalQR(qrData) {
  try {
    const response = await apiCall('POST', '/api/qr/rental/create', qrData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create rental QR',
    );
  }
}

// STUDENT: Scan rental QR from guard
export async function scanRentalQR(token) {
  try {
    const response = await apiCall('POST', '/api/qr/rental/scan', { token });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to scan rental QR',
    );
  }
}

// STUDENT: Create return QR for guard
export async function createReturnQR() {
  try {
    const response = await apiCall('POST', '/api/qr/return/create');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create return QR',
    );
  }
}

// GUARD: Scan return QR from student
export async function scanReturnQR(token, location) {
  try {
    const response = await apiCall('POST', '/api/qr/return/scan', {
      token,
      location,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to scan return QR',
    );
  }
}

// GUARD: Get active rentals
export async function getActiveRentals(location) {
  try {
    const params = location ? `?location=${location}` : '';
    const response = await apiCall('GET', `/api/qr/active-rentals${params}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch active rentals',
    );
  }
}

// GUARD: Process return QR (alias for scanReturnQR)
export async function processReturnQR(token, location) {
  return scanReturnQR(token, location);
}
