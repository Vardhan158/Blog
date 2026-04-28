import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  return socket;
};
