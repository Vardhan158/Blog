import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBlog, FaComments, FaSignOutAlt, FaUsers, FaTrash } from "react-icons/fa";
import {
  clearAdminSession,
  clearLegacyLocalAuth,
  getAdminToken,
} from "../utils/authStorage";

const tabs = [
  { id: "blogs", label: "Blogs", icon: <FaBlog /> },
  { id: "users", label: "Users", icon: <FaUsers /> },
  { id: "comments", label: "Comments", icon: <FaComments /> },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";
  const [activeTab, setActiveTab] = useState("blogs");
  const [dashboard, setDashboard] = useState({
    stats: { blogs: 0, users: 0, comments: 0 },
    blogs: [], users: [], comments: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const token = getAdminToken();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) { navigate("/login", { replace: true }); return; }
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboard({
          stats: res.data.stats || { blogs: 0, users: 0, comments: 0 },
          blogs: res.data.blogs || [],
          users: res.data.users || [],
          comments: res.data.comments || [],
        });
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) {
          clearAdminSession(); clearLegacyLocalAuth();
          navigate("/login", { replace: true }); return;
        }
        setErrorMsg(err.response?.data?.message || "Unable to load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [API_URL, navigate, token]);

  const rows = useMemo(() => dashboard[activeTab] || [], [activeTab, dashboard]);

  const handleLogout = () => {
    clearAdminSession(); clearLegacyLocalAuth();
    navigate("/login", { replace: true });
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm("Delete this blog?")) return;
    setDeletingId(blogId);
    try {
      await axios.delete(`${API_URL}/api/admin/blog/${blogId}`, { headers: { Authorization: `Bearer ${token}` } });
      setDashboard(prev => ({
        ...prev,
        blogs: prev.blogs.filter(b => b._id !== blogId),
        stats: { ...prev.stats, blogs: prev.stats.blogs - 1 }
      }));
    } catch (err) { alert(err.response?.data?.message || "Error deleting blog"); }
    finally { setDeletingId(null); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete this user?")) return;
    setDeletingId(userId);
    try {
      await axios.delete(`${API_URL}/api/admin/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setDashboard(prev => ({
        ...prev,
        users: prev.users.filter(u => u._id !== userId),
        stats: { ...prev.stats, users: prev.stats.users - 1 }
      }));
    } catch (err) { alert(err.response?.data?.message || "Error deleting user"); }
    finally { setDeletingId(null); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    setDeletingId(commentId);
    try {
      await axios.delete(`${API_URL}/api/admin/comment/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      const res = await axios.get(`${API_URL}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      setDashboard({
        stats: res.data.stats || { blogs: 0, users: 0, comments: 0 },
        blogs: res.data.blogs || [], users: res.data.users || [], comments: res.data.comments || [],
      });
    } catch (err) { alert(err.response?.data?.message || "Error deleting comment"); }
    finally { setDeletingId(null); }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const statConfig = [
    { key: "blogs",    label: "Total Blogs",    icon: <FaBlog />,     bg: "#eef2ff", iconColor: "#4f46e5", val: "#4f46e5" },
    { key: "users",    label: "Total Users",    icon: <FaUsers />,    bg: "#ecfdf5", iconColor: "#059669", val: "#059669" },
    { key: "comments", label: "Total Comments", icon: <FaComments />, bg: "#fff7ed", iconColor: "#ea580c", val: "#ea580c" },
  ];

  const renderContent = () => {
    if (loading) return (
      <div className="ad-empty">
        <div className="ad-spinner" />
        <p>Loading data…</p>
      </div>
    );
    if (errorMsg) return <div className="ad-empty ad-error">{errorMsg}</div>;
    if (!rows.length) return <div className="ad-empty">No {activeTab} found.</div>;

    if (activeTab === "blogs") return (
      <>
        <div className="ad-cards">
          {rows.map(blog => (
            <div key={blog._id} className="ad-card">
              <div className="ad-card-top">
                <div className="ad-card-info">
                  <p className="ad-card-title">{blog.title || "Untitled"}</p>
                  <p className="ad-card-sub">{blog.excerpt || "No content"}</p>
                </div>
                <button className="ad-del-btn" onClick={() => handleDeleteBlog(blog._id)} disabled={deletingId === blog._id}>
                  <FaTrash />
                </button>
              </div>
              <div className="ad-card-meta">
                <span><b>Author:</b> {blog.userId?.name || "Unknown"}</span>
                <span><b>Cat:</b> {blog.category || "None"}</span>
                <span>👍 {blog.likesCount ?? 0}</span>
                <span>💬 {blog.commentsCount ?? 0}</span>
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr>
              <th>Title</th><th>Author</th><th>Category</th>
              <th>Likes</th><th>Comments</th><th>Created</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map(blog => (
                <tr key={blog._id}>
                  <td>
                    <p className="ad-td-title">{blog.title || "Untitled"}</p>
                    <p className="ad-td-sub">{blog.excerpt || ""}</p>
                  </td>
                  <td>{blog.userId?.name || "Unknown"}</td>
                  <td><span className="ad-badge ad-badge-cat">{blog.category || "None"}</span></td>
                  <td>{blog.likesCount ?? 0}</td>
                  <td>{blog.commentsCount ?? 0}</td>
                  <td className="ad-td-date">{formatDate(blog.createdAt)}</td>
                  <td>
                    <button className="ad-del-btn" onClick={() => handleDeleteBlog(blog._id)} disabled={deletingId === blog._id}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );

    if (activeTab === "users") return (
      <>
        <div className="ad-cards">
          {rows.map(user => (
            <div key={user._id} className="ad-card">
              <div className="ad-card-top">
                <div className="ad-user-row">
                  <div className="ad-avatar">{(user.name || user.username || "?")[0].toUpperCase()}</div>
                  <div>
                    <p className="ad-card-title">{user.name || user.username}</p>
                    <p className="ad-card-sub">@{user.username}</p>
                  </div>
                </div>
                <button className="ad-del-btn" onClick={() => handleDeleteUser(user._id)} disabled={deletingId === user._id}>
                  <FaTrash />
                </button>
              </div>
              <div className="ad-card-meta" style={{ marginTop: 10 }}>
                <span className={`ad-badge ${user.role === "admin" ? "ad-badge-admin" : "ad-badge-user"}`}>
                  {user.role || "user"}
                </span>
                <span>{user.email}</span>
              </div>
              {user.description && <p className="ad-card-desc">{user.description}</p>}
            </div>
          ))}
        </div>

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr>
              <th>User</th><th>Email</th><th>Role</th><th>Description</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="ad-user-row">
                      <div className="ad-avatar">{(user.name || user.username || "?")[0].toUpperCase()}</div>
                      <div>
                        <p className="ad-td-title">{user.name || user.username}</p>
                        <p className="ad-td-sub">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`ad-badge ${user.role === "admin" ? "ad-badge-admin" : "ad-badge-user"}`}>
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="ad-td-sub">{user.description || "—"}</td>
                  <td>
                    <button className="ad-del-btn" onClick={() => handleDeleteUser(user._id)} disabled={deletingId === user._id}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );

    return (
      <div className="ad-comments">
        {rows.map((comment, index) => (
          <div key={comment._id || `${comment.blog?._id}-${index}`} className="ad-comment-row">
            <div className="ad-comment-body">
              <div className="ad-comment-header">
                <span className="ad-comment-user">{comment.user?.name || "Anonymous"}</span>
                <span className="ad-comment-on">on</span>
                <span className="ad-comment-blog">{comment.blog?.title || "Unknown blog"}</span>
                <span className="ad-comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="ad-comment-text">{comment.text || "No comment text"}</p>
            </div>
            <button className="ad-del-btn" onClick={() => handleDeleteComment(comment._id)} disabled={deletingId === comment._id}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .ad-root {
          min-height: 100vh;
          background: #f4f6fb;
          font-family: 'Poppins', sans-serif;
          color: #1e2235;
        }

        /* ── HEADER ── */
        .ad-header {
          background: #ffffff;
          border-bottom: 1px solid #e8ecf4;
          padding: 0 clamp(16px, 4vw, 36px);
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 12px rgba(79,70,229,0.06);
        }

        .ad-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ad-brand-logo {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .ad-brand-name {
          font-size: 16px;
          font-weight: 700;
          color: #1e2235;
          letter-spacing: -0.01em;
        }

        .ad-brand-tag {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4f46e5;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .ad-logout {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fff5f5;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.2s;
        }

        .ad-logout:hover {
          background: #dc2626;
          color: white;
          border-color: #dc2626;
        }

        /* ── MAIN ── */
        .ad-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px);
        }

        .ad-page-header {
          margin-bottom: clamp(20px, 3vw, 32px);
        }

        .ad-page-title {
          font-size: clamp(20px, 3.5vw, 26px);
          font-weight: 700;
          color: #1e2235;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }

        .ad-page-sub {
          font-size: 13px;
          color: #8892aa;
          font-weight: 400;
          margin: 0;
        }

        /* ── STAT CARDS ── */
        .ad-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(10px, 2vw, 18px);
          margin-bottom: clamp(20px, 4vw, 32px);
        }

        .ad-stat-card {
          background: #ffffff;
          border: 1px solid #e8ecf4;
          border-radius: 16px;
          padding: clamp(16px, 2.5vw, 24px);
          display: flex;
          align-items: center;
          gap: 14px;
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }

        .ad-stat-card:hover {
          box-shadow: 0 8px 28px rgba(79,70,229,0.1);
          transform: translateY(-2px);
        }

        .ad-stat-icon {
          width: clamp(40px, 6vw, 52px);
          height: clamp(40px, 6vw, 52px);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(16px, 2.5vw, 20px);
          flex-shrink: 0;
        }

        .ad-stat-text { min-width: 0; }

        .ad-stat-val {
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 700;
          line-height: 1;
          display: block;
          letter-spacing: -0.02em;
        }

        .ad-stat-lbl {
          font-size: clamp(10px, 1.6vw, 12px);
          color: #8892aa;
          margin-top: 4px;
          display: block;
          font-weight: 500;
        }

        /* ── PANEL ── */
        .ad-panel {
          background: #ffffff;
          border: 1px solid #e8ecf4;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(79,70,229,0.05);
        }

        .ad-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f2f8;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ad-tabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .ad-tabs::-webkit-scrollbar { display: none; }

        .ad-tab {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          white-space: nowrap;
          flex-shrink: 0;
          font-family: 'Poppins', sans-serif;
          transition: all 0.18s;
          color: #8892aa;
          background: transparent;
        }

        .ad-tab:hover { background: #f4f6fb; color: #1e2235; }

        .ad-tab.active {
          background: #4f46e5;
          color: white;
          box-shadow: 0 4px 14px rgba(79,70,229,0.35);
          font-weight: 600;
        }

        .ad-row-count {
          font-size: 12px;
          color: #8892aa;
          font-weight: 500;
          white-space: nowrap;
        }

        .ad-row-count b {
          color: #4f46e5;
          font-weight: 600;
        }

        .ad-panel-body { padding: clamp(12px, 2.5vw, 20px); }

        /* ── TABLE ── */
        .ad-table-wrap { display: none; overflow-x: auto; }

        @media (min-width: 640px) {
          .ad-table-wrap { display: block; }
          .ad-cards { display: none !important; }
        }

        .ad-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .ad-table thead tr { border-bottom: 2px solid #f0f2f8; }

        .ad-table th {
          padding: 10px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8892aa;
          white-space: nowrap;
        }

        .ad-table tbody tr {
          border-bottom: 1px solid #f5f6fa;
          transition: background 0.15s;
        }

        .ad-table tbody tr:last-child { border-bottom: none; }
        .ad-table tbody tr:hover { background: #f8f9fd; }

        .ad-table td {
          padding: 13px 16px;
          color: #3a4055;
          vertical-align: middle;
          font-size: 13px;
        }

        .ad-td-title {
          font-weight: 600;
          color: #1e2235;
          font-size: 13px;
          margin: 0 0 2px;
          max-width: 240px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ad-td-sub {
          font-size: 11px;
          color: #8892aa;
          margin: 0;
          max-width: 240px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 400;
        }

        .ad-td-date {
          font-size: 12px;
          color: #8892aa;
          white-space: nowrap;
        }

        /* ── BADGES ── */
        .ad-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .ad-badge-cat  { background: #eef2ff; color: #4f46e5; }
        .ad-badge-admin { background: #fff1f2; color: #e11d48; }
        .ad-badge-user  { background: #ecfdf5; color: #059669; }

        /* ── AVATAR ── */
        .ad-user-row { display: flex; align-items: center; gap: 10px; }

        .ad-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        /* ── DELETE BUTTON ── */
        .ad-del-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: #fff5f5;
          border: 1px solid #fecaca;
          color: #f87171;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.18s;
          flex-shrink: 0;
        }

        .ad-del-btn:hover { background: #dc2626; border-color: #dc2626; color: white; }
        .ad-del-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── MOBILE CARDS ── */
        .ad-cards { display: flex; flex-direction: column; gap: 10px; }

        .ad-card {
          background: #f8f9fd;
          border: 1px solid #e8ecf4;
          border-radius: 14px;
          padding: 14px;
        }

        .ad-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 8px;
        }

        .ad-card-info { flex: 1; min-width: 0; }

        .ad-card-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e2235;
          margin: 0 0 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ad-card-sub {
          font-size: 11px;
          color: #8892aa;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ad-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11px;
          color: #8892aa;
        }

        .ad-card-meta b { color: #3a4055; font-weight: 600; }
        .ad-card-desc { font-size: 11px; color: #8892aa; margin: 8px 0 0; font-style: italic; }

        /* ── COMMENTS ── */
        .ad-comments { display: flex; flex-direction: column; }

        .ad-comment-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid #f0f2f8;
        }

        .ad-comment-row:last-child { border-bottom: none; }
        .ad-comment-body { flex: 1; min-width: 0; }

        .ad-comment-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-bottom: 5px;
        }

        .ad-comment-user { font-size: 13px; font-weight: 600; color: #1e2235; }
        .ad-comment-on { font-size: 12px; color: #8892aa; }
        .ad-comment-blog {
          font-size: 12px; font-weight: 500; color: #4f46e5;
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; max-width: 180px;
        }
        .ad-comment-date { font-size: 11px; color: #8892aa; margin-left: auto; }
        .ad-comment-text { font-size: 13px; color: #5a6278; margin: 0; line-height: 1.65; }

        /* ── EMPTY / LOADING ── */
        .ad-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 52px 20px; gap: 12px;
          font-size: 14px; color: #8892aa; font-weight: 500;
        }

        .ad-error { color: #dc2626; }

        .ad-spinner {
          width: 30px; height: 30px;
          border: 3px solid #e8ecf4;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 420px) {
          .ad-brand-tag { display: none; }
          .ad-stat-card { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>

      <div className="ad-root">
        <header className="ad-header">
          <div className="ad-brand">
            <div className="ad-brand-logo">B</div>
            <span className="ad-brand-name">BlogPage</span>
            <span className="ad-brand-tag">Admin</span>
          </div>
          <button className="ad-logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </header>

        <main className="ad-main">
          <div className="ad-page-header">
            <h1 className="ad-page-title">Dashboard</h1>
            <p className="ad-page-sub">Manage your blogs, users, and comments</p>
          </div>

          {/* Stat cards */}
          <div className="ad-stats-grid">
            {statConfig.map((s) => (
              <div key={s.key} className="ad-stat-card">
                <div className="ad-stat-icon" style={{ background: s.bg, color: s.iconColor }}>
                  {s.icon}
                </div>
                <div className="ad-stat-text">
                  <span className="ad-stat-val" style={{ color: s.val }}>
                    {dashboard.stats[s.key]}
                  </span>
                  <span className="ad-stat-lbl">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tab panel */}
          <div className="ad-panel">
            <div className="ad-panel-header">
              <div className="ad-tabs">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`ad-tab ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              <p className="ad-row-count">
                <b>{rows.length}</b> {activeTab} found
              </p>
            </div>
            <div className="ad-panel-body">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;