// src/utils/axiosConfig.js
export const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
