import { io } from 'socket.io-client';

let socket;

const baseURL = import.meta.env.VITE_SERVER_URL;

export const initiateSocket = (userId) => {
  if (!socket || !socket.connected) {
    socket = io(`${baseURL}`, {
      query: { userId },
      transports: ['websocket'],
      withCredentials: true,
    });
    console.log("🔌 Socket connected");
  }
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("❌ Socket disconnected");
  }
};
