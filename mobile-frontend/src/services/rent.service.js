import { apiCall } from '../utils/api.util';

// GET ACTIVE RENTAL
export async function getActiveRental() {
  try {
    const response = await apiCall('GET', '/api/rentals/getByUser');
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
export async function getRentalHistory(filtersOrPage = 1, limit = 10) {
  try {
    let queryString = '';

    // Handle both old API (page, limit) and new API (filters object)
    if (typeof filtersOrPage === 'object' && filtersOrPage !== null) {
      // New API with filters object
      const queryParams = new URLSearchParams();

      if (filtersOrPage.location)
        queryParams.append('location', filtersOrPage.location);
      if (filtersOrPage.status)
        queryParams.append('status', filtersOrPage.status);
      if (filtersOrPage.page) queryParams.append('page', filtersOrPage.page);
      if (filtersOrPage.limit) queryParams.append('limit', filtersOrPage.limit);

      queryString = queryParams.toString();
    } else {
      // Old API with page and limit parameters
      queryString = `page=${filtersOrPage}&limit=${limit}`;
    }

    const response = await apiCall(
      'GET',
      `/api/rentals/history${queryString ? '?' + queryString : ''}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch rental history',
    );
  }
}

// GET STUDENT STATS
export async function getStudentStats() {
  try {
    const response = await apiCall('GET', '/api/rentals/stats');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch student stats',
    );
  }
}

// ADD RATING TO COMPLETED RENTAL
export async function addRating(rentalId, rating, comment) {
  try {
    const response = await apiCall('POST', '/api/rentals/rating', {
      rentalId,
      rating,
      comment,
    });
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

// GUARD-SPECIFIC METHODS

// GET ACTIVE RENTALS BY LOCATION (for guards)
export async function getActiveRentals(location) {
  try {
    const params = location ? `?location=${location}` : '';
    const response = await apiCall('GET', `/api/rentals/active${params}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch active rentals',
    );
  }
}
