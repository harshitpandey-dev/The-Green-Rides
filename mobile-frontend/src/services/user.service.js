import { apiCall } from '../utils/api.util';

// GET USER PROFILE
export async function getUserProfile() {
  try {
    const response = await apiCall('GET', '/api/users/profile');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user profile',
    );
  }
}

// UPDATE USER PROFILE
export async function updateUserProfile(profileData) {
  try {
    const response = await apiCall('PUT', '/api/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update profile',
    );
  }
}

// SEARCH STUDENTS (for guards)
export async function searchStudents(query) {
  try {
    const response = await apiCall(
      'GET',
      `/api/users/students/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to search students',
    );
  }
}

// CREATE USER (Admin only)
export async function createUser(userData) {
  try {
    const response = await apiCall('POST', '/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
}

// GET ALL USERS (Admin only)
export async function getAllUsers() {
  try {
    const response = await apiCall('GET', '/api/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
}

// GET USER BY ID (Admin only)
export async function getUserById(userId) {
  try {
    const response = await apiCall('GET', `/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user details',
    );
  }
}

// UPDATE USER (Admin only)
export async function updateUser(userId, updateData) {
  try {
    const response = await apiCall('PUT', `/api/users/${userId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
}

// DELETE USER (Admin only)
export async function deleteUser(userId) {
  try {
    await apiCall('DELETE', `/api/users/${userId}`);
    return 'User deleted successfully';
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
}

// GET USER STATISTICS (Admin/Finance only)
export async function getUserStatistics() {
  try {
    const response = await apiCall('GET', '/api/users/statistics');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user statistics',
    );
  }
}

// APPROVE PENDING USERS (Admin only)
export async function approvePendingUser(userId) {
  try {
    const response = await apiCall('POST', `/api/users/${userId}/approve`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to approve user');
  }
}

// GET PENDING USERS (Admin only)
export async function getPendingUsers() {
  try {
    const response = await apiCall('GET', '/api/users/pending');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch pending users',
    );
  }
}
