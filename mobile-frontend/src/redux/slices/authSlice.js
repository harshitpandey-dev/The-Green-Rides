import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginUser,
  registerUser,
  changePassword,
} from '../../services/auth.service';

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      if (response.token) {
        await AsyncStorage.setItem('GR_TOKEN', response.token);
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

export const loadTokenFromStorage = createAsyncThunk(
  'auth/loadToken',
  async () => {
    try {
      const token = await AsyncStorage.getItem('GR_TOKEN');
      if (token) {
        // You might want to validate token here
        return { token };
      }
      return null;
    } catch (error) {
      return null;
    }
  },
);

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isLoggedIn: false,
  isAuthReady: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      AsyncStorage.removeItem('GR_TOKEN');
    },
    clearError: state => {
      state.error = null;
    },
    setAuthReady: state => {
      state.isAuthReady = true;
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
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
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
      .addCase(registerAsync.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
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
      // Load Token
      .addCase(loadTokenFromStorage.fulfilled, (state, action) => {
        state.isAuthReady = true;
        if (action.payload) {
          state.token = action.payload.token;
          state.isLoggedIn = true;
          // You might want to fetch user data here
        }
      });
  },
});

export const { logout, clearError, setAuthReady } = authSlice.actions;
export default authSlice.reducer;
