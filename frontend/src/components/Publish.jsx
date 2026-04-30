import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { getToken } from "../utils/authStorage";

const Publish = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchUserBlogs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/blogs/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const htmlToPlainText = (html) =>
    DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });

  const formatDate = (b) => {
    const raw = b.publishDate || b.createdAt;
    return raw ? new Date(raw).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .pub-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        .blog-card {
          background: #fff;
          border: 1.5px solid #e8eaf6;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
        }
        .blog-card:hover {
          box-shadow: 0 8px 32px rgba(99,102,241,0.12);
          transform: translateY(-3px);
          border-color: #c7d2fe;
        }

        .blog-img {
          width: 100%;
          height: 190px;
          object-fit: cover;
          display: block;
          background: #f0f4ff;
        }

        .category-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          color: #6366f1;
          background: #ede9fe;
          border-radius: 20px;
          padding: 3px 10px;
          letter-spacing: 0.2px;
        }

        .new-btn {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 9px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: opacity 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .new-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 20px;
        }

        @media (max-width: 480px) {
          .pub-header { flex-direction: column; align-items: flex-start !important; }
          .new-btn { width: 100%; justify-content: center; }
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="pub-root"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)",
          padding: "40px 16px 60px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Page header */}
          <div
            className="pub-header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b", margin: "0 0 4px" }}>
                My Blogs
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                {loading ? "Fetching your posts…" : `${userBlogs.length} post${userBlogs.length !== 1 ? "s" : ""} published`}
              </p>
            </div>
            <button className="new-btn" onClick={() => navigate("/create")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Post
            </button>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="blog-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 20, overflow: "hidden" }}>
                  <div className="skeleton" style={{ height: 190 }} />
                  <div style={{ padding: "16px 18px" }}>
                    <div className="skeleton" style={{ height: 12, width: "35%", marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: "60%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 12, width: "90%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 12, width: "70%", marginBottom: 16 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <div className="skeleton" style={{ height: 12, width: "40%" }} />
                      <div className="skeleton" style={{ height: 12, width: "30%" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && userBlogs.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "64px 24px",
              borderRadius: 20,
              border: "1.5px dashed #c7d2fe",
              background: "#fafbff",
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: "#ede9fe",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 18px",
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M12 18v-6M9 15h6" />
                </svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#475569", margin: "0 0 6px" }}>
                No posts yet
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px" }}>
                Start writing and share your ideas with the world.
              </p>
              <button className="new-btn" style={{ margin: "0 auto" }} onClick={() => navigate("/create")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Write your first post
              </button>
            </div>
          )}

          {/* Blog grid */}
          {!loading && userBlogs.length > 0 && (
            <div className="blog-grid">
              {userBlogs.map((b) => (
                <div key={b._id} className="blog-card">

                  {/* Cover image */}
                  <img
                    src={b.featuredImage || "https://source.unsplash.com/600x400/?blog,writing"}
                    alt={b.title}
                    className="blog-img"
                    onError={(e) => { e.target.src = "https://source.unsplash.com/600x400/?blog,writing"; }}
                  />

                  <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>

                    {/* Category */}
                    {b.category && (
                      <span className="category-pill" style={{ marginBottom: 10, alignSelf: "flex-start" }}>
                        {b.category}
                      </span>
                    )}

                    {/* Title */}
                    <h4
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#1e1b4b",
                        margin: "0 0 8px",
                        lineHeight: 1.45,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {b.title}
                    </h4>

                    {/* Content preview */}
                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        lineHeight: 1.65,
                        margin: "0 0 14px",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flex: 1,
                      }}
                    >
                      {htmlToPlainText(b.content)}
                    </p>

                    {/* Footer row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 6,
                        paddingTop: 12,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      {/* Author */}
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1, #818cf8)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 600, color: "#fff", flexShrink: 0,
                        }}>
                          {(b.userId?.name || "U")[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>
                          {b.userId?.name || "Unknown"}
                        </span>
                      </div>

                      {/* Date */}
                      <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(b)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Publish;