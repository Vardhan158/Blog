import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const getVisibleCount = (width) => {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
};

const CARD_WIDTH = 320; // px - fixed card width
const CARD_GAP = 16;    // px - gap between cards

const Carousel = () => {
  const [visibleCount, setVisibleCount] = useState(() =>
    getVisibleCount(window.innerWidth)
  );
  const [blogs, setBlogs] = useState([]);
  const [tilt, setTilt] = useState({});
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const positionRef = useRef(0);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

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

  useEffect(() => {
    const handleResize = () =>
      setVisibleCount(getVisibleCount(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const duplicatedArticles = [...blogs, ...blogs, ...blogs];
  const STEP = CARD_WIDTH + CARD_GAP; // px per card

  useEffect(() => {
    const container = containerRef.current;
    if (!container || blogs.length === 0) return;

    positionRef.current = 0;
    const totalPx = blogs.length * STEP;
    const speed = visibleCount === 1 ? 0.4 : 0.6; // px per frame

    const animate = () => {
      positionRef.current += speed;
      if (positionRef.current >= totalPx) positionRef.current = 0;
      container.style.transform = `translateX(-${positionRef.current}px)`;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [visibleCount, blogs, STEP]);

  const threshold = 8;
  const handleMove = (e, id) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
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
    <section className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-6 sm:mb-10">
          Featured Blogs
        </h2>

        {blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-base sm:text-lg">
            No blogs found.
          </div>
        ) : (
          <div className="relative overflow-hidden border-t border-gray-200 pt-8 sm:pt-12">
            {/* Scroll track */}
            <div
              ref={containerRef}
              className="flex"
              style={{ gap: `${CARD_GAP}px`, willChange: "transform" }}
            >
              {duplicatedArticles.map((blog, index) => {
                const rotation = tilt[blog._id] || { x: 0, y: 0 };

                const profilePic =
                  blog?.userId?.profilePic &&
                  blog.userId.profilePic.trim() !== ""
                    ? blog.userId.profilePic.startsWith("http")
                      ? blog.userId.profilePic
                      : `${API_URL}/${blog.userId.profilePic.replace(/\\/g, "/")}`
                    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % blogs.length) * 0.06,
                    }}
                    onMouseMove={(e) => handleMove(e, blog._id)}
                    onMouseLeave={() => handleLeave(blog._id)}
                    style={{
                      transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                      width: `${CARD_WIDTH}px`,
                      flexShrink: 0,
                    }}
                  >
                    <Link
                      to={`/article/${blog._id}`}
                      className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] overflow-hidden h-full"
                    >
                      {/* Image */}
                      <div className="w-full h-44 bg-gray-100 overflow-hidden">
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-col flex-grow p-4">
                        {/* Meta */}
                        <div className="flex items-center gap-2 text-xs mb-2">
                          <time className="text-gray-400">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </time>
                          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-600 truncate max-w-[90px]">
                            {blog.category || "General"}
                          </span>
                        </div>

                        {/* Title + excerpt */}
                        <div className="flex-grow">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-2 leading-snug">
                            {blog.title}
                          </h3>
                          <p
                            className="mt-2 line-clamp-3 text-xs text-gray-500 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html:
                                blog.content?.slice(0, 120) ||
                                "No content available.",
                            }}
                          />
                        </div>

                        {/* Author */}
                        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                          <img
                            src={profilePic}
                            alt={blog.userId?.name || "Author"}
                            className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                            onError={(e) => {
                              e.target.src =
                                "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {blog.userId?.name || "Unknown Author"}
                            </p>
                            <p className="text-xs text-gray-400">Blogger</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Carousel;