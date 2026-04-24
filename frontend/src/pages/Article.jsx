import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaHeart, FaBookOpen, FaSearch } from "react-icons/fa";

export default function Article() {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) setUserId(user._id);
  }, []);

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/blogs`);
      const blogsData = Array.isArray(res.data.blogs)
        ? res.data.blogs
        : Array.isArray(res.data)
        ? res.data
        : [];
      setBlogs(blogsData);
      setFiltered(blogsData);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [API_URL]);

  // ✅ Search filter
  useEffect(() => {
    const results = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, blogs]);

  // ✅ Like handler
  const handleLike = async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to like blogs.");
        return;
      }

      if (loadingLike) return;
      setLoadingLike(true);

      await axios.put(
        `${API_URL}/api/blogs/like/${blogId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchBlogs();
    } catch (err) {
      console.error("Error liking blog:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  const isLikedByUser = (blog) => {
    if (!userId || !blog.likes) return false;
    return blog.likes.some((id) => id.toString() === userId.toString());
  };

  // ✅ Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6 mb-2"></div>
        <div className="flex justify-between mt-4">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-50 text-gray-800 px-6 md:px-16 lg:px-32 py-20">
        <div className="flex items-center justify-center mb-10">
          <FaBookOpen className="text-blue-600 text-4xl mr-3" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Latest Blog Articles
          </h1>
        </div>

        <div className="max-w-lg mx-auto mb-12 relative">
          <FaSearch className="absolute left-4 top-3.5 text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full pl-11 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* ✅ Loading State */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600">No articles found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((blog) => (
              <div
                key={blog._id}
                className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105"
              >
                {blog.featuredImage && (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-52 object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <Link to={`/article/${blog._id}`}>
                      <h2 className="text-xl font-semibold hover:underline text-gray-900">
                        {blog.title}
                      </h2>
                    </Link>

                    <button
                      onClick={() => handleLike(blog._id)}
                      disabled={loadingLike}
                      className="flex items-center gap-1 focus:outline-none"
                    >
                      <FaHeart
                        className={`text-2xl transition-transform ${
                          isLikedByUser(blog)
                            ? "text-pink-500 scale-110"
                            : "text-gray-400 hover:text-pink-400"
                        }`}
                      />
                      <span className="text-sm text-gray-700 ml-1">
                        {blog.likes?.length || 0}
                      </span>
                    </button>
                  </div>

                  <p
                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: blog.content || "No content available.",
                    }}
                  />

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {blog.userId?.name || "Anonymous"}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-4 text-right">
                    <Link
                      to={`/article/${blog._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
