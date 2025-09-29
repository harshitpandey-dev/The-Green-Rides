import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  rentCycle,
  returnCycle,
  getRentals,
} from '../../services/rent.service';

// Async thunks
export const rentCycleAsync = createAsyncThunk(
  'rentals/rentCycle',
  async (cycleData, { rejectWithValue }) => {
    try {
      const response = await rentCycle(cycleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const returnCycleAsync = createAsyncThunk(
  'rentals/returnCycle',
  async (rentalData, { rejectWithValue }) => {
    try {
      const response = await returnCycle(rentalData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchRentalsAsync = createAsyncThunk(
  'rentals/fetchRentals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRentals();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  rentals: [],
  activeRental: null,
  isLoading: false,
  error: null,
};

const rentalSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setActiveRental: (state, action) => {
      state.activeRental = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Rent Cycle
      .addCase(rentCycleAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rentCycleAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRental = action.payload;
        state.rentals.push(action.payload);
        state.error = null;
      })
      .addCase(rentCycleAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Return Cycle
      .addCase(returnCycleAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(returnCycleAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRental = null;
        // Update the rental in the array
        const index = state.rentals.findIndex(
          r => r._id === action.payload._id,
        );
        if (index !== -1) {
          state.rentals[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(returnCycleAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Rentals
      .addCase(fetchRentalsAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRentalsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rentals = action.payload;
        state.error = null;
      })
      .addCase(fetchRentalsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setActiveRental } = rentalSlice.actions;
export default rentalSlice.reducer;
