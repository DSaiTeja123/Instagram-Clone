import { configureStore } from '@reduxjs/toolkit';
import socketReducer from './socketSlice';

const store = configureStore({
  reducer: {
    socketio: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;