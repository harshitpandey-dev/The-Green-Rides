import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginUser,
  registerUser,
  googleSignUp,
  verifyOTP,
  resendOTP,
  changePassword,
  logoutUser,
} from '../../services/auth.service';
import { getUserProfile } from '../../services/user.service';

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);

      // Store tokens
      if (response.token) {
        await AsyncStorage.setItem('GR_TOKEN', response.token);
        if (response.refreshToken) {
          await AsyncStorage.setItem('GR_REFRESH_TOKEN', response.refreshToken);
        }
        if (response.user) {
          await AsyncStorage.setItem('GR_USER', JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const googleSignUpAsync = createAsyncThunk(
  'auth/googleSignUp',
  async (googleToken, { rejectWithValue }) => {
    try {
      const response = await googleSignUp(googleToken);

      // Store tokens if sign up is complete
      if (response.token) {
        await AsyncStorage.setItem('GR_TOKEN', response.token);
        if (response.refreshToken) {
          await AsyncStorage.setItem('GR_REFRESH_TOKEN', response.refreshToken);
        }
        if (response.user) {
          await AsyncStorage.setItem('GR_USER', JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const verifyOTPAsync = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await verifyOTP(email, otp);

      // Store tokens after successful verification
      if (response.token) {
        await AsyncStorage.setItem('GR_TOKEN', response.token);
        if (response.refreshToken) {
          await AsyncStorage.setItem('GR_REFRESH_TOKEN', response.refreshToken);
        }
        if (response.user) {
          await AsyncStorage.setItem('GR_USER', JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const resendOTPAsync = createAsyncThunk(
  'auth/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await resendOTP(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await changePassword(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      // Clear storage regardless of server response
      await AsyncStorage.multiRemove([
        'GR_TOKEN',
        'GR_REFRESH_TOKEN',
        'GR_USER',
      ]);
      return true;
    } catch (error) {
      // Still clear storage on error
      await AsyncStorage.multiRemove([
        'GR_TOKEN',
        'GR_REFRESH_TOKEN',
        'GR_USER',
      ]);
      return true;
    }
  },
);

export const loadTokenFromStorage = createAsyncThunk(
  'auth/loadToken',
  async () => {
    try {
      const [token, refreshToken, userStr] = await AsyncStorage.multiGet([
        'GR_TOKEN',
        'GR_REFRESH_TOKEN',
        'GR_USER',
      ]);

      const tokenValue = token[1];
      const refreshTokenValue = refreshToken[1];
      const userData = userStr[1] ? JSON.parse(userStr[1]) : null;

      if (tokenValue && userData) {
        return {
          token: tokenValue,
          refreshToken: refreshTokenValue,
          user: userData,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  },
);

export const refreshUserProfile = createAsyncThunk(
  'auth/refreshUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUserProfile();
      await AsyncStorage.setItem('GR_USER', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isLoggedIn: false,
  isAuthReady: false,
  isVerified: true, // For OTP verification flow
  pendingEmail: null, // Email pending OTP verification
  error: null,
  registrationStep: null, // 'otp_pending', 'completed'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setAuthReady: state => {
      state.isAuthReady = true;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setPendingEmail: (state, action) => {
      state.pendingEmail = action.payload;
    },
    clearPendingRegistration: state => {
      state.registrationStep = null;
      state.pendingEmail = null;
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isLoggedIn = true;
        state.isVerified = action.payload.user?.isVerified || false;
        state.error = null;

        if (!state.isVerified) {
          state.pendingEmail = action.payload.user?.email;
          state.registrationStep = 'otp_pending';
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        if (action.payload.requiresOTP) {
          state.registrationStep = 'otp_pending';
          state.pendingEmail = action.payload.email;
        } else {
          state.registrationStep = 'completed';
        }
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Google Sign Up
      .addCase(googleSignUpAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleSignUpAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.isLoggedIn = true;
          state.isVerified = true;
          state.registrationStep = 'completed';
        } else {
          state.registrationStep = 'otp_pending';
          state.pendingEmail = action.payload.email;
        }

        state.error = null;
      })
      .addCase(googleSignUpAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOTPAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTPAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isLoggedIn = true;
        state.isVerified = true;
        state.registrationStep = 'completed';
        state.pendingEmail = null;
        state.error = null;
      })
      .addCase(verifyOTPAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendOTPAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOTPAsync.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendOTPAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePasswordAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutAsync.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.isVerified = true;
        state.pendingEmail = null;
        state.registrationStep = null;
        state.error = null;
      })

      // Load Token
      .addCase(loadTokenFromStorage.fulfilled, (state, action) => {
        state.isAuthReady = true;
        if (action.payload) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
          state.isLoggedIn = true;
          state.isVerified = action.payload.user?.isVerified || false;

          if (!state.isVerified) {
            state.pendingEmail = action.payload.user?.email;
            state.registrationStep = 'otp_pending';
          }
        }
      })

      // Refresh User Profile
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const {
  clearError,
  setAuthReady,
  updateUserProfile,
  setPendingEmail,
  clearPendingRegistration,
} = authSlice.actions;

export default authSlice.reducer;
