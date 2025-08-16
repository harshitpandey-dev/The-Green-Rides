import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cycleSlice from './slices/cycleSlice';
import rentalSlice from './slices/rentalSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cycles: cycleSlice,
    rentals: rentalSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// TypeScript type exports for use in components
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
