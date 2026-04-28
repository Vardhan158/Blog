import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Carousel = () => {
  const [isLarge, setIsLarge] = useState(() => window.innerWidth >= 1024);
  const [blogs, setBlogs] = useState([]);
  const [tilt, setTilt] = useState({});
  const containerRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

  // ✅ Fetch blogs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await axios.get(`${API_URL}/api/blogs`);
        const blogsData = blogRes.data.blogs || blogRes.data || [];
        setBlogs(blogsData.reverse());
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchData();
  }, [API_URL]);

  // ✅ Window resize listener
  useEffect(() => {
    const handleResize = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCount = isLarge ? 3 : 1;
  const slideWidth = 100 / visibleCount;
  const duplicatedArticles = [...blogs, ...blogs, ...blogs];

  // ✅ Infinite scroll animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || blogs.length === 0) return;

    let position = 0;
    const totalWidth = (blogs.length * 100) / visibleCount;

    const animate = () => {
      position += 0.007;
      if (position >= totalWidth) position = 0;
      container.style.transform = `translateX(-${position}%)`;
      requestAnimationFrame(animate);
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isLarge, blogs, visibleCount]);

  // ✅ Tilt effect
  const threshold = 8;
  const handleMove = (e, id) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt((prev) => ({
      ...prev,
      [id]: { x: y * -threshold, y: x * threshold },
    }));
  };

  const handleLeave = (id) => {
    setTilt((prev) => ({ ...prev, [id]: { x: 0, y: 0 } }));
  };

  return (
    <section className="bg-white sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-10">
          Featured Blogs
        </h2>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No blogs found.
          </div>
        ) : (
          <div className="relative overflow-hidden border-t border-gray-200 pt-10 sm:pt-16">
            <div
              ref={containerRef}
              className="flex transition-transform ease-linear"
              style={{
                width: `${(duplicatedArticles.length * 100) / visibleCount}%`,
              }}
            >
              {duplicatedArticles.map((blog, index) => {
                const rotation = tilt[blog._id] || { x: 0, y: 0 };

                // ✅ Handle user image safely
                const profilePic =
                  blog?.userId?.profilePic && blog.userId.profilePic.trim() !== ""
                    ? blog.userId.profilePic.startsWith("http")
                      ? blog.userId.profilePic
                      : `${API_URL}/${blog.userId.profilePic.replace(/\\/g, "/")}`
                    : "https://cdn-icons-png.flaticon.com/512/847/847969.png"; // default avatar

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onMouseMove={(e) => handleMove(e, blog._id)}
                    onMouseLeave={() => handleLeave(blog._id)}
                    style={{
                      transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    }}
                    className="w-full lg:w-1/3 max-w-xl mx-auto lg:mx-0 px-4 shrink-0"
                  >
                    <Link
                      to={`/article/${blog._id}`}
                      className="block flex flex-col justify-between bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 p-6"
                    >
                      {blog.featuredImage && (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}

                      <div className="flex items-center gap-x-4 text-xs mb-2">
                        <time className="text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </time>
                        <span className="rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-600">
                          {blog.category || "General"}
                        </span>
                      </div>

                      <div className="group relative flex-grow">
                        <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                          {blog.title}
                        </h3>
                        <p
                          className="mt-4 line-clamp-3 text-sm text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html:
                              blog.content?.slice(0, 120) ||
                              "No content available.",
                          }}
                        />
                      </div>

                      <div className="mt-8 flex items-center gap-x-4">
                        <img
                          src={profilePic}
                          alt={blog.userId?.name || "Author"}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.src =
                              "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                          }}
                        />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-800">
                            {blog.userId?.name || "Unknown Author"}
                          </p>
                          <p className="text-gray-500">Blogger</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Carousel;
