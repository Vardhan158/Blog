const USER_KEYS = ["token", "user", "username", "profileImage"];
const ADMIN_KEYS = ["adminToken", "adminUser"];

const storage = typeof window !== "undefined" ? window.sessionStorage : null;

const readJson = (key) => {
  if (!storage) return null;

  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const writeJson = (key, value) => {
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
};

export const getToken = () => storage?.getItem("token") || null;
export const setToken = (value) => storage?.setItem("token", value);

export const getUser = () => readJson("user");
export const setUser = (value) => writeJson("user", value);

export const getUsername = () => storage?.getItem("username") || "";
export const setUsername = (value) => storage?.setItem("username", value);

export const getProfileImage = () => storage?.getItem("profileImage") || "";
export const setProfileImage = (value) => storage?.setItem("profileImage", value);

export const getAdminToken = () => storage?.getItem("adminToken") || null;
export const setAdminToken = (value) => storage?.setItem("adminToken", value);

export const getAdminUser = () => readJson("adminUser");
export const setAdminUser = (value) => writeJson("adminUser", value);

export const clearUserSession = () => {
  if (!storage) return;
  USER_KEYS.forEach((key) => storage.removeItem(key));
};

export const clearAdminSession = () => {
  if (!storage) return;
  ADMIN_KEYS.forEach((key) => storage.removeItem(key));
};

export const clearLegacyLocalAuth = () => {
  if (typeof window === "undefined") return;

  [...USER_KEYS, ...ADMIN_KEYS].forEach((key) => window.localStorage.removeItem(key));
};
