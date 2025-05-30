import { io } from "socket.io-client";

let socket = null;

export const initiateSocket = (userId) => {
  if (!socket || !socket.connected) {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      query: { userId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Optionally: handle connect/disconnect for debugging
    socket.on("connect", () => {
      // console.log("Socket connected:", socket.id);
    });
    socket.on("disconnect", () => {
      // console.log("Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

/**
 * Utility to add a listener and ensure it's not duplicated.
 * Usage: addSocketListener('typing', cb)
 */
export const addSocketListener = (event, cb) => {
  if (!socket) return;
  socket.off(event); // Remove previous listener to avoid duplicates
  socket.on(event, cb);
};

/**
 * Utility to emit events.
 * Usage: emitSocketEvent('typing', { to, from })
 */
export const emitSocketEvent = (event, data) => {
  if (!socket) return;
  socket.emit(event, data);
};
