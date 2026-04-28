const USER_KEYS = ["token", "user", "username", "profileImage"];
const ADMIN_KEYS = ["adminToken", "adminUser"];

const sessionStorageRef = typeof window !== "undefined" ? window.sessionStorage : null;
const localStorageRef = typeof window !== "undefined" ? window.localStorage : null;

const readRaw = (key) => {
  const sessionValue = sessionStorageRef?.getItem(key);
  if (sessionValue !== null && sessionValue !== undefined) {
    return sessionValue;
  }

  const localValue = localStorageRef?.getItem(key);
  if (localValue !== null && localValue !== undefined && sessionStorageRef) {
    sessionStorageRef.setItem(key, localValue);
  }

  return localValue;
};

const readJson = (key) => {
  const value = readRaw(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const writeJson = (key, value) => {
  const serialized = JSON.stringify(value);
  sessionStorageRef?.setItem(key, serialized);
  localStorageRef?.setItem(key, serialized);
};

const writeValue = (key, value) => {
  sessionStorageRef?.setItem(key, value);
  localStorageRef?.setItem(key, value);
};

export const getToken = () => readRaw("token") || null;
export const setToken = (value) => writeValue("token", value);
export const getUser = () => readJson("user");
export const setUser = (value) => writeJson("user", value);

export const getUsername = () => readRaw("username") || "";
export const setUsername = (value) => writeValue("username", value);

export const getProfileImage = () => readRaw("profileImage") || "";
export const setProfileImage = (value) => writeValue("profileImage", value);

export const getAdminToken = () => readRaw("adminToken") || null;
export const setAdminToken = (value) => writeValue("adminToken", value);

export const getAdminUser = () => readJson("adminUser");
export const setAdminUser = (value) => writeJson("adminUser", value);

export const clearUserSession = () => {
  USER_KEYS.forEach((key) => {
    sessionStorageRef?.removeItem(key);
    localStorageRef?.removeItem(key);
  });
};

export const clearAdminSession = () => {
  ADMIN_KEYS.forEach((key) => {
    sessionStorageRef?.removeItem(key);
    localStorageRef?.removeItem(key);
  });
};

export const clearLegacyLocalAuth = () => {
  if (typeof window === "undefined") return;

  [...USER_KEYS, ...ADMIN_KEYS].forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });
};
