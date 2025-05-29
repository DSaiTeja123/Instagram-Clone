import { io } from "socket.io-client";

let socket = null;

export const initiateSocket = (userId) => {
  if (!socket || !socket.connected) {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      query: { userId },
      transports: ["websocket"],
    });
  }
  return socket;
};

export const getSocket = () => socket;
export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
