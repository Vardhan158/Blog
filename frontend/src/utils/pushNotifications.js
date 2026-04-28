import axios from "axios";
import { getToken } from "./authStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/sw.js");
};

export const enablePushNotifications = async () => {
  const token = getToken();
  if (!token) return;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  if (Notification.permission === "denied") return;

  const registration = await registerServiceWorker();
  if (!registration) return;

  let permission = Notification.permission;
  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return;

  const { data } = await axios.get(`${API_URL}/api/user/push/public-key`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!data?.publicKey) return;

  const existingSubscription = await registration.pushManager.getSubscription();
  const subscription =
    existingSubscription ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    }));

  await axios.post(`${API_URL}/api/user/push/subscribe`, subscription, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const disablePushNotifications = async () => {
  const token = getToken();
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;

  try {
    if (token) {
      await axios.post(
        `${API_URL}/api/user/push/unsubscribe`,
        { endpoint: subscription.endpoint },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } finally {
    await subscription.unsubscribe();
  }
};

export const showBrowserNotification = async (notification) => {
  if (typeof window === "undefined" || !notification?.message) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const title = notification.actor?.name || "BlogPage";
  const options = {
    body: notification.message,
    icon: "/vite.svg",
    badge: "/vite.svg",
    tag: notification._id || undefined,
    data: {
      url: notification.blog?._id ? `/article/${notification.blog._id}` : "/dashboard",
    },
  };

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.showNotification(title, options);
      return;
    }
  }

  const browserNotification = new Notification(title, options);
  browserNotification.onclick = () => {
    window.focus();
    const url = options.data.url;
    if (url && window.location.pathname !== url) {
      window.location.assign(url);
    }
    browserNotification.close();
  };
};
