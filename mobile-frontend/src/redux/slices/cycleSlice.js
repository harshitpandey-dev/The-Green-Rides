import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCycles } from '../../services/cycle.service';

// Async thunks
export const fetchCyclesAsync = createAsyncThunk(
  'cycles/fetchCycles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCycles();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  cycles: [],
  isLoading: false,
  error: null,
};

const cycleSlice = createSlice({
  name: 'cycles',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCyclesAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCyclesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cycles = action.payload;
        state.error = null;
      })
      .addCase(fetchCyclesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = cycleSlice.actions;
export default cycleSlice.reducer;
