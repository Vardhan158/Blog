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

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-xs sm:text-sm font-medium text-gray-500">{label}</span>
      <span className="text-indigo-600 text-sm sm:text-base">{icon}</span>
    </div>
    <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2 sm:mt-3">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";
  const [activeTab, setActiveTab] = useState("blogs");
  const [dashboard, setDashboard] = useState({
    stats: { blogs: 0, users: 0, comments: 0 },
    blogs: [],
    users: [],
    comments: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const token = getAdminToken();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
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
          clearAdminSession();
          clearLegacyLocalAuth();
          navigate("/login", { replace: true });
          return;
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
    clearAdminSession();
    clearLegacyLocalAuth();
    navigate("/login", { replace: true });
  };

  // ✅ Delete handlers
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog? This will also delete all comments on it.")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(prev => ({
        ...prev,
        blogs: prev.blogs.filter(b => b._id !== blogId),
        stats: { ...prev.stats, blogs: prev.stats.blogs - 1 }
      }));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(err.response?.data?.message || "Error deleting blog");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete all their blogs and comments.")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(prev => ({
        ...prev,
        users: prev.users.filter(u => u._id !== userId),
        stats: { ...prev.stats, users: prev.stats.users - 1 }
      }));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(err.response?.data?.message || "Error deleting comment");
    } finally {
      // ✅ Always refresh to ensure consistency
      try {
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
        console.error("Error refreshing dashboard:", err);
      }
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "No date";

  const renderTable = () => {
    if (loading) return <p className="text-gray-500 py-4 text-sm">Loading admin data...</p>;
    if (errorMsg) return <p className="text-red-600 py-4 text-sm">{errorMsg}</p>;
    if (!rows.length) return <p className="text-gray-500 py-4 text-sm">No {activeTab} found.</p>;

    if (activeTab === "blogs") {
      return (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {rows.map((blog) => (
              <div key={blog._id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm leading-snug">
                      {blog.title || "Untitled"}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {blog.excerpt || "No content"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="text-red-600 hover:text-red-800 text-lg flex-shrink-0"
                    title="Delete blog"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                  <span><span className="font-medium text-gray-700">Author:</span> {blog.userId?.name || "Unknown"}</span>
                  <span><span className="font-medium text-gray-700">Category:</span> {blog.category || "None"}</span>
                  <span>👍 {blog.likesCount}</span>
                  <span>💬 {blog.commentsCount}</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Likes</th>
                  <th className="px-4 py-3 font-medium">Comments</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((blog) => (
                  <tr key={blog._id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{blog.title || "Untitled"}</p>
                      <p className="text-gray-500 mt-1 max-w-md">{blog.excerpt || "No content"}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{blog.userId?.name || "Unknown"}</td>
                    <td className="px-4 py-4 text-gray-700">{blog.category || "None"}</td>
                    <td className="px-4 py-4 text-gray-700">{blog.likesCount}</td>
                    <td className="px-4 py-4 text-gray-700">{blog.commentsCount}</td>
                    <td className="px-4 py-4 text-gray-700">{formatDate(blog.createdAt)}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete blog"
                      >
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
    }

    if (activeTab === "users") {
      return (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {rows.map((user) => (
              <div key={user._id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {user.name || user.username}
                    </p>
                    <p className="text-gray-500 text-xs">@{user.username}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-800 text-lg flex-shrink-0"
                    title="Delete user"
                  >
                    <FaTrash />
                  </button>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 inline-block mt-2">
                  {user.role || "user"}
                </span>
                <p className="text-xs text-gray-600 mt-2">{user.email}</p>
                {user.description && (
                  <p className="text-xs text-gray-500 mt-1">{user.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{user.name || user.username}</p>
                      <p className="text-gray-500">@{user.username}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {user.description || "No description"}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete user"
                      >
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
    }

    // Comments
    return (
      <div className="divide-y divide-gray-100">
        {rows.map((comment, index) => (
          <div
            key={comment._id || `${comment.blog?._id}-${index}`}
            className="py-3 sm:py-4 flex justify-between items-start gap-4"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  {comment.user?.name || "Anonymous"}
                </span>
                <span>on</span>
                <span className="font-medium text-gray-900">
                  {comment.blog?.title || "Unknown blog"}
                </span>
                <span className="ml-auto text-xs">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="mt-1.5 text-sm text-gray-700">{comment.text || "No comment text"}</p>
            </div>
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-red-600 hover:text-red-800 transition flex-shrink-0 text-lg"
              title="Delete comment"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-medium text-indigo-600">BlogPage Admin</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            <FaSignOutAlt />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Stat cards */}
        <section className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard label="Blogs" value={dashboard.stats.blogs} icon={<FaBlog />} />
          <StatCard label="Users" value={dashboard.stats.users} icon={<FaUsers />} />
          <StatCard label="Comments" value={dashboard.stats.comments} icon={<FaComments />} />
        </section>

        {/* Tab panel */}
        <section className="mt-5 sm:mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Tab bar — horizontally scrollable on small screens */}
          <div className="flex items-center gap-2 border-b border-gray-200 p-3 sm:p-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">{renderTable()}</div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;