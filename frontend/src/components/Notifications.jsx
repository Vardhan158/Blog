import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaCheck } from "react-icons/fa";
import { connectSocketForUser } from "../utils/socket";
import { getToken, getUser } from "../utils/authStorage";

const Notifications = ({ onUnreadCountChange }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = getToken();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/notifications`, axiosConfig);
      setNotifications(res.data.notifications || []);
      onUnreadCountChange?.(res.data.unreadCount || 0);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const user = getUser() || {};
    if (!user?._id) return;

    const socket = connectSocketForUser(user._id);
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      onUnreadCountChange?.((prev) =>
        typeof prev === "number" ? prev + 1 : prev
      );
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [onUnreadCountChange]);

  const markAllRead = async () => {
    try {
      await axios.put(`${API_URL}/api/notifications/read`, {}, axiosConfig);
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      onUnreadCountChange?.(0);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Unable to update notifications.");
    }
  };

  const formatDate = (value) => (value ? new Date(value).toLocaleString() : "");

  if (loading) return <p className="text-center mt-4">Loading notifications...</p>;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500">Activity from people who interact with your blogs.</p>
        </div>
        <button
          onClick={markAllRead}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          <FaCheck />
          Mark all read
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-lg border p-4 shadow-sm ${
                notification.read
                  ? "border-gray-200 bg-white"
                  : "border-indigo-200 bg-indigo-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 text-indigo-600">
                  <FaBell />
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.message}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{formatDate(notification.createdAt)}</span>
                    {notification.blog?.title && <span>Blog: {notification.blog.title}</span>}
                  </div>
                </div>
                {!notification.read && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                    New
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
