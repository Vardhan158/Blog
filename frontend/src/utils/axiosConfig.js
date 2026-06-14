import axios from "axios";
import { getToken } from "./authStorage";

// Create axios instance with default timeout
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://blog-backend-omyx.onrender.com",
  timeout: 10000, // 10 second default timeout
});

// src/utils/axiosConfig.js
export const getAuthConfig = () => {
  const token = getToken();
  if (!token) return null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000, // 10 second timeout
  };
};

// Add auth header to axios instance requests
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

