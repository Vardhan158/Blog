import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const getVisibleCount = (width) => {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
};

const CARD_WIDTH = 300;
const CARD_GAP = 20;
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const getProfilePic = (userId, apiUrl) => {
  const image = userId?.profileImage || userId?.avatar || "";
  if (!image || image.trim() === "") return DEFAULT_AVATAR;
  if (image.startsWith("http")) return image;
  return `${apiUrl}/uploads/${image.replace(/\\/g, "/")}`;
};

const Carousel = () => {
  const [visibleCount, setVisibleCount] = useState(() =>
    getVisibleCount(window.innerWidth)
  );
  const [blogs, setBlogs] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const positionRef = useRef(0);
  const isPausedRef = useRef(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

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
    const handleResize = () => setVisibleCount(getVisibleCount(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const duplicatedArticles = [...blogs, ...blogs, ...blogs];
  const STEP = CARD_WIDTH + CARD_GAP;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || blogs.length === 0) return;

    positionRef.current = 0;
    const totalPx = blogs.length * STEP;
    const speed = visibleCount === 1 ? 0.35 : 0.5;

    const animate = () => {
      if (!isPausedRef.current) {
        positionRef.current += speed;
        if (positionRef.current >= totalPx) positionRef.current = 0;
        container.style.transform = `translateX(-${positionRef.current}px)`;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [visibleCount, blogs, STEP]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .carousel-section {
          background: #f7f4ef;
          padding: 56px 0 64px;
          overflow: hidden;
          position: relative;
        }

        .carousel-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9bfad' fill-opacity='0.18'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        .carousel-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 700;
          color: #1a1209;
          text-align: center;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .carousel-subheading {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #8c7b65;
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .carousel-track-wrap {
          position: relative;
          overflow: hidden;
          padding: 12px 0 20px;
        }

        .blog-card {
          background: #fffdf8;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e6ddd0;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }

        .blog-card:hover {
          box-shadow: 0 16px 48px rgba(60, 40, 10, 0.13);
          transform: translateY(-5px) scale(1.012);
          border-color: #c9a96e;
        }

        .card-image-wrap {
          width: 100%;
          height: 176px;
          overflow: hidden;
          background: #ede8df;
          position: relative;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .blog-card:hover .card-image-wrap img {
          transform: scale(1.06);
        }

        .card-no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #c9bfad;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          padding: 16px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .card-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #a89880;
          letter-spacing: 0.04em;
        }

        .card-category {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #1a1209;
          color: #f7f4ef;
          padding: 2px 9px;
          border-radius: 3px;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: #1a1209;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 8px;
          flex-grow: 1;
        }

        .card-excerpt {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #7a6e60;
          line-height: 1.7;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 14px;
        }

        .card-author {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-top: 12px;
          border-top: 1px solid #ede8df;
          margin-top: auto;
        }

        .card-author img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #e0d5c5;
          flex-shrink: 0;
        }

        .author-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #3a2e22;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: #a89880;
          letter-spacing: 0.05em;
        }

        .fade-left {
          pointer-events: none;
          position: absolute;
          inset-y: 0;
          left: 0;
          width: clamp(40px, 8vw, 80px);
          background: linear-gradient(to right, #f7f4ef, transparent);
          z-index: 10;
        }

        .fade-right {
          pointer-events: none;
          position: absolute;
          inset-y: 0;
          right: 0;
          width: clamp(40px, 8vw, 80px);
          background: linear-gradient(to left, #f7f4ef, transparent);
          z-index: 10;
        }

        .no-blogs {
          text-align: center;
          padding: 60px 20px;
          font-family: 'DM Sans', sans-serif;
          color: #a89880;
          font-size: 15px;
        }
      `}</style>

      <section className="carousel-section">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>
          <p className="carousel-subheading">Latest Stories</p>
          <h2 className="carousel-heading">Featured Blogs</h2>
        </div>

        {blogs.length === 0 ? (
          <div className="no-blogs">No blogs found.</div>
        ) : (
          <div className="carousel-track-wrap">
            <div className="fade-left" />
            <div className="fade-right" />

            <div
              ref={containerRef}
              style={{
                display: "flex",
                gap: `${CARD_GAP}px`,
                willChange: "transform",
                paddingLeft: "clamp(16px, 5vw, 48px)",
              }}
              onMouseEnter={() => { isPausedRef.current = true; }}
              onMouseLeave={() => { isPausedRef.current = false; }}
            >
              {duplicatedArticles.map((blog, index) => {
                const profilePic = getProfilePic(blog.userId, API_URL);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % blogs.length) * 0.05,
                      ease: "easeOut",
                    }}
                    style={{ width: `${CARD_WIDTH}px`, flexShrink: 0 }}
                  >
                    <Link to={`/article/${blog._id}`} className="blog-card">
                      {/* Image */}
                      <div className="card-image-wrap">
                        {blog.featuredImage ? (
                          <img src={blog.featuredImage} alt={blog.title} />
                        ) : (
                          <div className="card-no-image">✦</div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="card-body">
                        <div className="card-meta">
                          <time className="card-date">
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </time>
                          <span className="card-category">
                            {blog.category || "General"}
                          </span>
                        </div>

                        <h3 className="card-title">{blog.title}</h3>

                        <p
                          className="card-excerpt"
                          dangerouslySetInnerHTML={{
                            __html: blog.content?.replace(/<[^>]+>/g, "").slice(0, 100) || "No content available.",
                          }}
                        />

                        <div className="card-author">
                          <img
                            src={profilePic}
                            alt={blog.userId?.name || "Author"}
                            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <p className="author-name">{blog.userId?.name || "Unknown Author"}</p>
                            <p className="author-role">Blogger</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Carousel;