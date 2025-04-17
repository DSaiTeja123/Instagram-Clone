import { configureStore } from '@reduxjs/toolkit';
import socketReducer from './socketSlice';

const store = configureStore({
  reducer: {
    socketio: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // important: avoid errors for storing socket
    }),
});

export default store;