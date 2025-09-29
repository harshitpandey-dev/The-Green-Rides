import { apiCall } from '../utils/api.util';

// REGISTER USER
export async function registerUser(userData) {
  try {
    const response = await apiCall('POST', '/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

// LOGIN USER
export async function loginUser(credentials) {
  try {
    const response = await apiCall('POST', '/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

// GOOGLE SIGN UP
export async function googleSignUp(googleToken) {
  try {
    const response = await apiCall('POST', '/api/auth/google-signup', {
      googleToken,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Google sign up failed');
  }
}

// VERIFY OTP
export async function verifyOTP(email, otp) {
  try {
    const response = await apiCall('POST', '/api/auth/verify-otp', {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
}

// RESEND OTP
export async function resendOTP(email) {
  try {
    const response = await apiCall('POST', '/api/auth/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
}

// FORGOT PASSWORD
export async function forgotPassword(email) {
  try {
    const response = await apiCall('POST', '/api/auth/forgot-password', {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to send reset email',
    );
  }
}

// RESET PASSWORD
export async function resetPassword(token, newPassword) {
  try {
    const response = await apiCall('POST', '/api/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
}

// CHANGE PASSWORD
export async function changePassword(passwords) {
  try {
    const response = await apiCall(
      'PUT',
      '/api/auth/change-password',
      passwords,
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password change failed');
  }
}

// LOGOUT USER
export async function logoutUser() {
  try {
    const response = await apiCall('POST', '/api/auth/logout');
    return response.data;
  } catch (error) {
    // Even if logout fails on server, we should clear local storage
    console.warn('Logout request failed, clearing local data anyway');
    return { message: 'Logged out locally' };
  }
}

// REFRESH TOKEN
export async function refreshToken() {
  try {
    const response = await apiCall('POST', '/api/auth/refresh');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
}
