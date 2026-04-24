import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

const Publish = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch user's blogs
  const fetchUserBlogs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/blogs/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched blogs:", res.data.blogs);
      setUserBlogs(res.data.blogs || []);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserBlogs();
  }, [token, navigate]);

  // Convert HTML to plain text safely
  const htmlToPlainText = (html) => {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Blogs</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : userBlogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {userBlogs.map((b) => (
              <div
                key={b._id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
              >
                {/* Blog title & category */}
                <h4 className="text-xl font-semibold text-gray-900">{b.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{b.category}</p>

                {/* Blog image */}
                {b.featuredImage ? (
                  <img
                    src={b.featuredImage} // ✅ Cloudinary URLs don’t need API_URL
                    alt={b.title}
                    className="w-full h-40 object-cover rounded-lg mt-4"
                  />
                ) : (
                  <img
                    src="https://source.unsplash.com/600x400/?blog,writing"
                    alt="Default"
                    className="w-full h-40 object-cover rounded-lg mt-4"
                  />
                )}

                {/* Blog content preview */}
                <p className="mt-4 text-gray-700 whitespace-pre-wrap line-clamp-4">
                  {htmlToPlainText(b.content)}
                </p>

                {/* Published date */}
                <p className="text-xs text-gray-400 mt-2">
                  Published:{" "}
                  {b.publishDate
                    ? new Date(b.publishDate).toLocaleDateString()
                    : b.createdAt
                    ? new Date(b.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* Author details */}
                <p className="text-xs text-gray-500">
                  Author: {b.userId?.name || "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Publish;
