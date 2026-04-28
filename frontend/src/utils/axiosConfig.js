import { getToken } from "./authStorage";

// src/utils/axiosConfig.js
export const getAuthConfig = () => {
  const token = getToken();
  if (!token) return null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
