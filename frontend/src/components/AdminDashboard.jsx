import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBlog, FaComments, FaSignOutAlt, FaUsers } from "react-icons/fa";

const tabs = [
  { id: "blogs", label: "Blogs", icon: <FaBlog /> },
  { id: "users", label: "Users", icon: <FaUsers /> },
  { id: "comments", label: "Comments", icon: <FaComments /> },
];

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-indigo-600">{icon}</span>
    </div>
    <p className="text-3xl font-semibold text-gray-900 mt-3">{value}</p>
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

  const token = localStorage.getItem("adminToken");

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
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
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
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login", { replace: true });
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "No date");

  const renderTable = () => {
    if (loading) return <p className="text-gray-500">Loading admin data...</p>;
    if (errorMsg) return <p className="text-red-600">{errorMsg}</p>;
    if (!rows.length) return <p className="text-gray-500">No {activeTab} found.</p>;

    if (activeTab === "blogs") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Likes</th>
                <th className="px-4 py-3 font-medium">Comments</th>
                <th className="px-4 py-3 font-medium">Created</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "users") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Description</th>
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
                  <td className="px-4 py-4 text-gray-700">{user.description || "No description"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-100">
        {rows.map((comment, index) => (
          <div key={comment._id || `${comment.blog?._id}-${index}`} className="py-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-900">{comment.user?.name || "Anonymous"}</span>
              <span>on</span>
              <span className="font-medium text-gray-900">{comment.blog?.title || "Unknown blog"}</span>
              <span>{formatDate(comment.createdAt)}</span>
            </div>
            <p className="mt-2 text-gray-700">{comment.text || "No comment text"}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">BlogPage Admin</p>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Blogs" value={dashboard.stats.blogs} icon={<FaBlog />} />
          <StatCard label="Users" value={dashboard.stats.users} icon={<FaUsers />} />
          <StatCard label="Comments" value={dashboard.stats.comments} icon={<FaComments />} />
        </section>

        <section className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
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
          <div className="p-4">{renderTable()}</div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
