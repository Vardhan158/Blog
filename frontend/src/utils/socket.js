import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

let socket;
let joinedUserId = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });

    socket.on("connect", () => {
      if (joinedUserId) {
        socket.emit("join-user", joinedUserId);
      }
    });
  }

  return socket;
};

export const connectSocketForUser = (userId) => {
  if (!userId) return null;

  const activeSocket = getSocket();
  joinedUserId = userId.toString();

  if (!activeSocket.connected) {
    activeSocket.connect();
  } else {
    activeSocket.emit("join-user", joinedUserId);
  }

  return activeSocket;
};
