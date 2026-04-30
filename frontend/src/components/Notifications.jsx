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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .notif-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        .notif-card {
          background: #fff;
          border: 1.5px solid #e8eaf6;
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .notif-card:hover { box-shadow: 0 4px 16px rgba(99,102,241,0.08); }
        .notif-card.unread {
          background: #f5f3ff;
          border-color: #c7d2fe;
        }

        .notif-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notif-icon-wrap.unread { background: #ede9fe; }
        .notif-icon-wrap.read { background: #f1f5f9; }

        .mark-all-btn {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 9px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .mark-all-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .mark-all-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 480px) {
          .notif-header-row { flex-direction: column; align-items: flex-start !important; }
          .mark-all-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div
        className="notif-root"
        style={{
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 4px",
        }}
      >
        {/* Header */}
        <div
          className="notif-header-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1e1b4b", margin: 0 }}>
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 20,
                    padding: "2px 9px",
                    lineHeight: 1.6,
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
              Activity from people interacting with your blogs
            </p>
          </div>

          {notifications.some((n) => !n.read) && (
            <button className="mark-all-btn" onClick={markAllRead}>
              <FaCheck size={11} />
              Mark all read
            </button>
          )}
        </div>

        {/* Error */}
        {errorMsg && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 12,
              background: "#fff5f5",
              border: "1px solid #fecaca",
              fontSize: 13,
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M9 0a9 9 0 1 1 0 18A9 9 0 0 1 9 0Zm0 13.5a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm0-3.6a.9.9 0 0 0 .9-.9V5.4a.9.9 0 1 0-1.8 0v3.6a.9.9 0 0 0 .9.9Z" fill="#EF4444" />
            </svg>
            {errorMsg}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1.5px solid #e8eaf6",
                  borderRadius: 16,
                  padding: "16px 18px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "52px 24px",
              borderRadius: 16,
              border: "1.5px dashed #c7d2fe",
              background: "#fafbff",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <FaBell size={22} color="#6366f1" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#475569", margin: "0 0 4px" }}>
              All caught up!
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
              No notifications yet. Check back later.
            </p>
          </div>
        )}

        {/* Notification list */}
        {!loading && notifications.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notif-card ${notification.read ? "read" : "unread"}`}
              >
                {/* Icon */}
                <div className={`notif-icon-wrap ${notification.read ? "read" : "unread"}`}>
                  <FaBell
                    size={15}
                    color={notification.read ? "#94a3b8" : "#6366f1"}
                  />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: notification.read ? 400 : 500,
                      color: notification.read ? "#475569" : "#1e1b4b",
                      margin: "0 0 6px",
                      lineHeight: 1.5,
                    }}
                  >
                    {notification.message}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                      </svg>
                      {formatDate(notification.createdAt)}
                    </span>
                    {notification.blog?.title && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#6366f1",
                          background: "#ede9fe",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontWeight: 500,
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {notification.blog.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Unread badge */}
                {!notification.read && (
                  <span
                    style={{
                      flexShrink: 0,
                      background: "linear-gradient(135deg, #6366f1, #818cf8)",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 20,
                      padding: "3px 9px",
                      alignSelf: "flex-start",
                      lineHeight: 1.6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;