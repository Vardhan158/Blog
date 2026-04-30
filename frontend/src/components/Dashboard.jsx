import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import EditProfile from "./EditProfile";
import Navbar from "./Navbar";
import CreateBlog from "./CreateBlog";
import Publish from "./Publish";
import Notifications from "./Notifications";
import axios from "axios";
import { connectSocketForUser } from "../utils/socket";
import { getToken } from "../utils/authStorage";
import {
  enablePushNotifications,
  showBrowserNotification,
} from "../utils/pushNotifications";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .db-root {
    --ink:    #1a1714;
    --ink2:   #4a4540;
    --ink3:   #8a847c;
    --ink4:   #b8b2a9;
    --paper:  #faf8f4;
    --paper2: #f2ede6;
    --paper3: #e8e2d8;
    --rule:   #e0dbd2;
    --accent: #c0392b;
    display: flex;
    min-height: 100vh;
    background: var(--paper2);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ── Main content area ── */
  .db-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .db-content {
    flex: 1;
    padding: clamp(24px, 4vw, 44px) clamp(20px, 4vw, 44px);
    animation: fadeUp 0.4s ease both;
  }

  /* ── Loading skeleton ── */
  .db-skel {
    background: var(--paper3);
    border-radius: 2px;
    position: relative;
    overflow: hidden;
  }
  .db-skel::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: shimmer 1.6s infinite;
  }

  /* ── Section heading ── */
  .db-section-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: clamp(20px, 3.5vw, 32px);
  }
  .db-section-title {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(10px, 1.6vw, 11px);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink3);
    margin: 0;
    white-space: nowrap;
  }
  .db-section-line {
    flex: 1;
    height: 1px;
    background: var(--rule);
  }
  .db-section-count {
    font-size: clamp(10px, 1.6vw, 11px);
    font-weight: 700;
    background: var(--accent);
    color: #fff;
    padding: 2px 9px;
    border-radius: 2px;
    white-space: nowrap;
  }

  /* ── Blog + Comments grid ── */
  .db-comments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
    gap: clamp(14px, 2.5vw, 22px);
  }

  .db-blog-card {
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: clamp(16px, 3vw, 24px);
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.22s cubic-bezier(.16,1,.3,1), transform 0.22s;
    animation: fadeUp 0.4s ease both;
  }
  .db-blog-card:hover {
    box-shadow: 0 8px 28px rgba(26,23,20,0.09);
    transform: translateY(-2px);
  }

  .db-blog-category {
    display: inline-block;
    align-self: flex-start;
    font-size: clamp(9px, 1.4vw, 10px);
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: var(--accent);
    color: #fff;
    padding: 3px 10px;
    border-radius: 2px;
    margin-bottom: 10px;
  }

  .db-blog-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(16px, 2.5vw, 20px);
    font-weight: 600;
    color: var(--ink);
    margin: 0 0 8px;
    line-height: 1.3;
  }

  .db-blog-excerpt {
    font-size: clamp(13px, 1.8vw, 14px);
    color: var(--ink3);
    line-height: 1.65;
    margin: 0 0 14px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  /* Stats row */
  .db-stats-row {
    display: flex;
    gap: 16px;
    padding: 10px 0;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
    margin-bottom: 14px;
  }
  .db-stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: clamp(12px, 1.8vw, 13px);
    color: var(--ink3);
    font-weight: 500;
  }
  .db-stat-icon { font-size: 13px; }

  /* Comment list inside card */
  .db-comments-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .db-comment-row {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--rule);
  }
  .db-comment-row:last-child { border-bottom: none; padding-bottom: 0; }

  .db-comment-avatar {
    width: clamp(28px, 4vw, 34px);
    height: clamp(28px, 4vw, 34px);
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid var(--rule);
    flex-shrink: 0;
  }
  .db-comment-user {
    margin: 0;
    font-weight: 600;
    font-size: clamp(12px, 1.8vw, 13px);
    color: var(--ink);
  }
  .db-comment-text {
    margin: 2px 0 0;
    font-size: clamp(12px, 1.8vw, 13px);
    color: var(--ink2);
    line-height: 1.55;
  }
  .db-comment-date {
    margin: 2px 0 0;
    font-size: 10px;
    color: var(--ink4);
  }
  .db-no-comments {
    font-size: clamp(12px, 1.8vw, 13px);
    color: var(--ink4);
    font-style: italic;
  }

  /* ── Empty state ── */
  .db-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: clamp(48px, 10vw, 80px) 0;
    color: var(--ink3);
  }
  .db-empty-icon { font-size: clamp(32px, 6vw, 44px); }
  .db-empty-text { font-size: clamp(13px, 2vw, 15px); }

  /* ── Loading state ── */
  .db-loading {
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 2.5vw, 18px);
  }
  .db-loading-card {
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: 22px 24px;
  }

  /* ── Responsive sidebar handling ── */
  @media (max-width: 640px) {
    .db-content {
      padding: 20px 16px;
    }
  }
`;

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

/* Loading skeleton for comments view */
const BlogCardSkeleton = () => (
  <div className="db-loading-card">
    <div className="db-skel" style={{ width: 60, height: 18, marginBottom: 12 }} />
    <div className="db-skel" style={{ width: "75%", height: 16, marginBottom: 8 }} />
    <div className="db-skel" style={{ width: "55%", height: 14, marginBottom: 16 }} />
    <div className="db-skel" style={{ width: "100%", height: 12, marginBottom: 8 }} />
    <div className="db-skel" style={{ width: "85%", height: 12 }} />
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("create-blog");
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [commentsData, setCommentsData] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  const token = getToken();
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return console.error("No token found. Please login.");
      try {
        const res = await axios.get(`${API_URL}/api/user/profile`, axiosConfig);
        setUserData(res.data.user || res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/notifications`, axiosConfig);
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error("Error fetching notification count:", err);
      }
    };
    fetchUnreadCount();
  }, [token]);

  useEffect(() => {
    enablePushNotifications().catch((err) =>
      console.error("Unable to enable push notifications:", err)
    );
  }, []);

  useEffect(() => {
    if (!userData?._id) return;
    const socket = connectSocketForUser(userData._id);
    if (!socket) return;
    const handleNewNotification = (notification) => {
      setUnreadCount((prev) => prev + 1);
      showBrowserNotification(notification).catch((err) =>
        console.error("Unable to show browser notification:", err)
      );
    };
    socket.on("notification:new", handleNewNotification);
    return () => { socket.off("notification:new", handleNewNotification); };
  }, [userData?._id]);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!token) return;
      try {
        setLoadingBlogs(true);
        const res = await axios.get(`${API_URL}/api/blogs/user`, axiosConfig);
        setBlogs(Array.isArray(res.data.blogs) ? res.data.blogs : []);
      } catch (err) {
        console.error("Error fetching user blogs:", err);
        setBlogs([]);
      } finally {
        setLoadingBlogs(false);
      }
    };
    if (activeTab === "comments" || activeTab === "published-blogs") {
      fetchUserBlogs();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchAllComments = async () => {
      if (!token || blogs.length === 0) return;
      const newCommentsData = {};
      for (const blog of blogs) {
        try {
          const res = await axios.get(`${API_URL}/api/comments/blog/${blog._id}`, axiosConfig);
          newCommentsData[blog._id] = res.data || [];
        } catch (err) {
          console.error(`Error fetching comments for blog ${blog._id}:`, err);
          newCommentsData[blog._id] = [];
        }
      }
      setCommentsData(newCommentsData);
    };
    if (activeTab === "comments") fetchAllComments();
  }, [activeTab, blogs]);

  const handleLike = async (blogId) => {
    if (!token) return;
    try {
      await axios.put(`${API_URL}/api/blogs/like/${blogId}`, {}, axiosConfig);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId
            ? {
                ...b,
                likes: b.likes.includes(userData._id)
                  ? b.likes.filter((id) => id !== userData._id)
                  : [...b.likes, userData._id],
              }
            : b
        )
      );
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  /* ── Comments tab ── */
  const renderComments = () => {
    if (loadingBlogs) return (
      <div className="db-loading">
        {[0, 1, 2, 3].map((i) => <BlogCardSkeleton key={i} />)}
      </div>
    );

    if (blogs.length === 0) return (
      <div className="db-empty">
        <span className="db-empty-icon">📝</span>
        <span className="db-empty-text">No blogs posted yet.</span>
      </div>
    );

    const totalComments = blogs.reduce(
      (sum, b) => sum + (commentsData[b._id]?.length || 0), 0
    );

    return (
      <>
        <div className="db-section-heading">
          <p className="db-section-title">Your Blogs & Comments</p>
          {totalComments > 0 && (
            <span className="db-section-count">{totalComments} comments</span>
          )}
          <div className="db-section-line" />
        </div>

        <div className="db-comments-grid">
          {blogs.map((blog, i) => {
            const comments = commentsData[blog._id] || [];
            const excerpt = blog.content?.replace(/<[^>]+>/g, "") || "";

            return (
              <div
                key={blog._id}
                className="db-blog-card"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {blog.category && (
                  <span className="db-blog-category">{blog.category}</span>
                )}
                <h3 className="db-blog-title">{blog.title}</h3>
                {excerpt && (
                  <p className="db-blog-excerpt">{excerpt}</p>
                )}

                <div className="db-stats-row">
                  <span className="db-stat">
                    <span className="db-stat-icon">♥</span>
                    {Array.isArray(blog.likes) ? blog.likes.length : 0}
                  </span>
                  <span className="db-stat">
                    <span className="db-stat-icon">💬</span>
                    {comments.length}
                  </span>
                </div>

                {comments.length > 0 ? (
                  <div className="db-comments-inner">
                    {comments.map((c) => (
                      <div key={c._id} className="db-comment-row">
                        <img
                          src={c.user?.avatar || DEFAULT_AVATAR}
                          alt={c.user?.name || "User"}
                          className="db-comment-avatar"
                          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <p className="db-comment-user">{c.user?.name || "Anonymous"}</p>
                          <p className="db-comment-text">{c.text || "No comment text"}</p>
                          {c.createdAt && (
                            <p className="db-comment-date">
                              {new Date(c.createdAt).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric"
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="db-no-comments">No comments yet.</p>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "create-blog":
        return <CreateBlog userData={userData} setActiveTab={setActiveTab} />;

      case "published-blogs":
        if (loadingBlogs) return (
          <div className="db-content">
            <div className="db-section-heading">
              <p className="db-section-title">Published Posts</p>
              <div className="db-section-line" />
            </div>
            <div className="db-loading">
              {[0, 1, 2].map((i) => <BlogCardSkeleton key={i} />)}
            </div>
          </div>
        );
        return <Publish userData={userData} blogs={blogs} handleLike={handleLike} />;

      case "comments":
        return (
          <div className="db-content">{renderComments()}</div>
        );

      case "edit-profile":
        return <EditProfile userData={userData} setUserData={setUserData} />;

      case "notifications":
        return <Notifications onUnreadCountChange={setUnreadCount} />;

      default:
        return <div className="db-content" />;
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <Navbar userData={userData} />
      <div className="db-root">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
        />
        <main className="db-main">
          {renderContent()}
        </main>
      </div>
    </>
  );
}