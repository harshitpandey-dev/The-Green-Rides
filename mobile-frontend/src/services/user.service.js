import { apiCall } from '../utils/api.util';

// GET CURRENT USER PROFILE
export async function getCurrentUser() {
  try {
    const response = await apiCall('GET', '/api/users/me');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user profile',
    );
  }
}

// UPDATE STUDENT PROFILE (limited fields)
export async function updateStudentProfile(profileData) {
  try {
    const response = await apiCall('PATCH', '/api/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update profile',
    );
  }
}

// SEARCH STUDENTS BY ROLL NUMBER (for guards)
export async function getStudentByRollNumber(rollNumber) {
  try {
    const response = await apiCall('GET', `/api/users/rollno/${rollNumber}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Student not found');
  }
}

// GET GUARD DASHBOARD DATA
export async function getGuardDashboard(guardId) {
  try {
    const response = await apiCall(
      'GET',
      `/api/users/guard/${guardId}/dashboard`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch dashboard data',
    );
  }
}

// UPDATE GUARD PROFILE
export async function updateGuardProfile(guardId, profileData) {
  try {
    const response = await apiCall(
      'PATCH',
      '/api/users/guard/profile',
      profileData,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update profile',
    );
  }
}

// CHANGE PASSWORD
export async function changePassword(passwordData) {
  try {
    const response = await apiCall(
      'PATCH',
      '/api/users/password',
      passwordData,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to change password',
    );
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
