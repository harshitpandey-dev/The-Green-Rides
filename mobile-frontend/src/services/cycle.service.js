import { apiCall } from '../utils/api.util';

// GET ALL CYCLES
export async function getAllCycles() {
  try {
    const response = await apiCall('GET', '/api/cycles');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch cycles');
  }
}

// GET CYCLES BY LOCATION
export async function getCyclesByLocation(location) {
  try {
    const response = await apiCall('GET', `/api/cycles/location/${location}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch cycles by location',
    );
  }
}

// ADD CYCLE (Admin only)
export async function addCycle(cycleData) {
  try {
    const response = await apiCall('POST', '/api/cycles', cycleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add cycle');
  }
}

// UPDATE CYCLE (Admin only)
export async function updateCycle(cycleId, updateData) {
  try {
    const response = await apiCall('PUT', `/api/cycles/${cycleId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update cycle');
  }
}

// DELETE CYCLE (Admin only)
export async function deleteCycle(cycleId) {
  try {
    await apiCall('DELETE', `/api/cycles/${cycleId}`);
    return 'Cycle deleted successfully';
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete cycle');
  }
}

// GET CYCLE BY ID
export async function getCycleById(cycleId) {
  try {
    const response = await apiCall('GET', `/api/cycles/${cycleId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch cycle details',
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

// GET CYCLES FOR MAINTENANCE
export async function getCyclesForMaintenance() {
  try {
    const response = await apiCall('GET', '/api/cycles/maintenance/due');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch maintenance cycles',
    );
  }
}

// UPDATE CYCLE MAINTENANCE STATUS
export async function updateMaintenanceStatus(cycleId, status) {
  try {
    const response = await apiCall(
      'PUT',
      `/api/cycles/${cycleId}/maintenance`,
      { status },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update maintenance status',
    );
  }
}
