import { apiCall } from '../utils/api.util';

// GET ACTIVE RENTAL
export async function getActiveRental() {
  try {
    const response = await apiCall('GET', '/api/rentals/active');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // No active rental
    }
    throw new Error(
      error.response?.data?.message || 'Failed to fetch active rental',
    );
  }
}

// GET RENTAL HISTORY
export async function getRentalHistory() {
  try {
    const response = await apiCall('GET', '/api/rentals/history');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch rental history',
    );
  }
}

// GET ALL RENTALS (Admin/Finance only)
export async function getAllRentals() {
  try {
    const response = await apiCall('GET', '/api/rentals');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch all rentals',
    );
  }
}

// GET RENTAL BY ID
export async function getRentalById(rentalId) {
  try {
    const response = await apiCall('GET', `/api/rentals/${rentalId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch rental details',
    );
  }
}

// SUBMIT CYCLE RATING
export async function submitCycleRating(cycleId, ratingData) {
  try {
    const response = await apiCall(
      'POST',
      `/api/cycles/${cycleId}/rating`,
      ratingData,
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit rating');
  }
}

// GET RENTAL STATISTICS (Admin/Finance only)
export async function getRentalStatistics(dateRange) {
  try {
    const response = await apiCall('GET', '/api/rentals/statistics', {
      params: dateRange,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch rental statistics',
    );
  }
}

// GET OVERDUE RENTALS (Admin/Finance only)
export async function getOverdueRentals() {
  try {
    const response = await apiCall('GET', '/api/rentals/overdue');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch overdue rentals',
    );
  }
}

// PROCESS MANUAL RETURN (Admin/Guard only)
export async function processManualReturn(rentalId, returnData) {
  try {
    const response = await apiCall(
      'POST',
      `/api/rentals/${rentalId}/manual-return`,
      returnData,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to process manual return',
    );
  }
}

// APPLY FINE (Admin/Finance only)
export async function applyFine(userId, fineData) {
  try {
    const response = await apiCall(
      'POST',
      `/api/users/${userId}/fine`,
      fineData,
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to apply fine');
  }
}

// WAIVE FINE (Admin only)
export async function waiveFine(userId, amount) {
  try {
    const response = await apiCall('POST', `/api/users/${userId}/waive-fine`, {
      amount,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to waive fine');
  }
}
