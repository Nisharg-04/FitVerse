import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import gymReducer from './slices/gymSlice.ts';
import authReducer from './slices/authSlice.ts';

export const store = configureStore({
  reducer: {
        auth: authReducer,
        // Add other slices here
        gym: gymReducer, // Assuming gymSlice is imported from gymSlice.ts    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check if needed
    }),
});

// Types for Redux state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
