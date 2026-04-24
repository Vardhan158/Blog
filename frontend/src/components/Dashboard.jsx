import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import EditProfile from "./EditProfile";
import Navbar from "./Navbar";
import CreateBlog from "./CreateBlog";
import Publish from "./Publish";
import axios from "axios";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("create-blog");
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [commentsData, setCommentsData] = useState({}); // store blogId => comments[]

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return console.error("No token found. Please login.");
      try {
        const res = await axios.get(`${API_URL}/api/user/profile`, axiosConfig);
        console.log("User profile fetched:", res.data);
        setUserData(res.data.user || res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [token]);

  // Fetch user blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!token) return;
      try {
        setLoadingBlogs(true);
        const res = await axios.get(`${API_URL}/api/blogs/user`, axiosConfig);
        console.log("User blogs fetched:", res.data);
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

  // Fetch comments for each blog when comments tab is active
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

    if (activeTab === "comments") {
      fetchAllComments();
    }
  }, [activeTab, blogs]);

  // Like a blog
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

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "create-blog":
        return <CreateBlog userData={userData} setActiveTab={setActiveTab} />;

      case "published-blogs":
        if (loadingBlogs) return <p className="text-center mt-4">Loading your blogs...</p>;
        return <Publish userData={userData} blogs={blogs} handleLike={handleLike} />;

      case "comments":
        if (loadingBlogs) return <p className="text-center mt-4">Loading your blogs...</p>;

        return (
          <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Your Blogs & Comments</h2>

            {blogs.length === 0 ? (
              <p className="text-center text-gray-500">No blogs posted yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => {
                  const comments = commentsData[blog._id] || [];

                  return (
                    <div key={blog._id} className="p-4 bg-white rounded-lg shadow flex flex-col">
                      <h3 className="font-semibold text-lg">{blog.title}</h3>
                      <p className="text-gray-600 mb-2">{blog.category}</p>
                      <p className="text-gray-700 mb-2 line-clamp-3">
                        {blog.content.replace(/<[^>]+>/g, "")}
                      </p>

                      <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center gap-1">
                          ❤️ {Array.isArray(blog.likes) ? blog.likes.length : 0}
                        </div>
                        <div className="flex items-center gap-1">
                          💬 {comments.length}
                        </div>
                      </div>

                      {/* Display comments */}
                      {comments.length > 0 ? (
                        <div className="text-gray-700 text-sm space-y-2 mt-2">
                          {comments.map((c) => (
                            <div key={c._id} className="border-b border-gray-200 pb-1 flex items-start gap-2">
                              <img
                                src={c.user?.avatar || "https://randomuser.me/api/portraits/men/45.jpg"}
                                alt={c.user?.name || "User"}
                                className="w-8 h-8 rounded-full border"
                              />
                              <div>
                                <p className="font-semibold text-gray-800">{c.user?.name || "Anonymous"}</p>
                                <p className="text-gray-600">{c.text || "No comment text"}</p>
                                <small className="text-gray-400 text-xs">
                                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm mt-2">No comments yet.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case "edit-profile":
        return <EditProfile userData={userData} setUserData={setUserData} />;

      default:
        return <div>Welcome!</div>;
    }
  };

  return (
    <>
      <Navbar userData={userData} />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </>
  );
}
