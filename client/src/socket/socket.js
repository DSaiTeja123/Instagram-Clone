import { io } from 'socket.io-client';

let socket;

export const initiateSocket = (userId) => {
  if (!socket || !socket.connected) {
    socket = io("http://localhost:8000", {
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
