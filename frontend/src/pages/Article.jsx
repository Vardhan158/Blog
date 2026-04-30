import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaHeart, FaSearch } from "react-icons/fa";
import { getToken, getUser } from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

const SkeletonCard = () => (
  <div style={styles.card}>
    <div style={{ ...styles.cardImg, background: "#e5e7eb" }} />
    <div style={{ padding: "1.1rem 1.25rem" }}>
      {[75, 90, 55, 40].map((w, i) => (
        <div key={i} style={{ height: 10, background: "#e5e7eb", borderRadius: 4, marginBottom: 8, width: `${w}%` }} />
      ))}
    </div>
  </div>
);

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

export default function Article() {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (user?._id) setUserId(user._id);
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/blogs`);
      const data = Array.isArray(res.data.blogs) ? res.data.blogs : Array.isArray(res.data) ? res.data : [];
      setBlogs(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      setBlogs([]); setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  useEffect(() => {
    setFiltered(blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase())));
  }, [search, blogs]);

  const handleLike = async (blogId) => {
    const token = getToken();
    if (!token) return alert("Please log in to like blogs.");
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      await axios.put(`${API_URL}/api/blogs/like/${blogId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await fetchBlogs();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLike(false);
    }
  };

  const isLiked = (blog) =>
    userId && blog.likes?.some((id) => id.toString() === userId.toString());

  return (
    <>
      <Navbar />
      <section style={styles.section}>
        {/* Hero */}
        <div style={styles.hero}>
          <span style={styles.tag}>Blog</span>
          <h1 style={styles.h1}>Latest articles</h1>
          <p style={styles.sub}>Discover stories, tips, and guides from our community</p>
        </div>

        {/* Search */}
        <div style={styles.searchWrap}>
          <FaSearch style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", fontFamily: "'Poppins', sans-serif" }}>No articles found.</p>
        ) : (
          <div style={styles.grid}>
            {filtered.map((blog) => (
              <div key={blog._id} style={styles.card} className="blog-card">
                {blog.featuredImage ? (
                  <img src={blog.featuredImage} alt={blog.title} style={styles.cardImg} />
                ) : (
                  <div style={{ ...styles.cardImg, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                    </svg>
                  </div>
                )}

                <div style={{ padding: "1.1rem 1.25rem 1rem" }}>
                  <div style={styles.cardTop}>
                    <Link to={`/article/${blog._id}`} style={styles.cardTitle}>
                      {blog.title}
                    </Link>
                    <button onClick={() => handleLike(blog._id)} disabled={loadingLike} style={styles.likeBtn}>
                      <FaHeart style={{ fontSize: 15, color: isLiked(blog) ? "#f472b6" : "#d1d5db", transition: "color .15s" }} />
                      <span style={styles.likeCount}>{blog.likes?.length || 0}</span>
                    </button>
                  </div>

                  <p
                    style={styles.excerpt}
                    dangerouslySetInnerHTML={{ __html: blog.content || "No content available." }}
                  />

                  <div style={styles.meta}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={styles.avatar}>{initials(blog.userId?.name || "AN")}</div>
                      <span>{blog.userId?.name || "Anonymous"}</span>
                    </div>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>

                  <Link to={`/article/${blog._id}`} style={styles.readMore}>
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        .blog-card { transition: transform .2s ease, box-shadow .2s ease; }
        .blog-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.07); }
      `}</style>
    </>
  );
}

const styles = {
  section: {
    minHeight: "100vh", background: "#f9fafb",
    fontFamily: "'Poppins', sans-serif",
    padding: "2.5rem 1.5rem", color: "#111827",
  },
  hero: { textAlign: "center", marginBottom: "2rem" },
  tag: {
    display: "inline-block", background: "#eef4ff", color: "#2563eb",
    fontSize: 11, fontWeight: 500, letterSpacing: ".1em",
    textTransform: "uppercase", padding: "4px 14px", borderRadius: 20, marginBottom: ".75rem",
  },
  h1: { fontSize: "1.75rem", fontWeight: 600, color: "#111827", lineHeight: 1.25 },
  sub: { fontSize: ".85rem", color: "#6b7280", fontWeight: 300, marginTop: ".4rem" },
  searchWrap: { maxWidth: 480, margin: "0 auto 2.5rem", position: "relative" },
  searchIcon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 },
  searchInput: {
    width: "100%", border: "1px solid #e5e7eb", borderRadius: 40,
    padding: "10px 16px 10px 42px", fontFamily: "'Poppins', sans-serif",
    fontSize: ".85rem", color: "#111827", background: "#fff", outline: "none",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" },
  card: { background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden" },
  cardImg: { width: "100%", height: 160, objectFit: "cover", display: "block" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: ".5rem" },
  cardTitle: { fontSize: ".95rem", fontWeight: 600, color: "#111827", lineHeight: 1.35, flex: 1, textDecoration: "none" },
  likeBtn: { display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 },
  likeCount: { fontSize: ".75rem", color: "#6b7280" },
  excerpt: {
    fontSize: ".775rem", color: "#6b7280", lineHeight: 1.65, fontWeight: 300,
    marginBottom: ".85rem", display: "-webkit-box", WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  meta: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    fontSize: ".72rem", color: "#9ca3af",
    borderTop: "1px solid #f5f5f5", paddingTop: ".75rem",
  },
  avatar: {
    width: 22, height: 22, borderRadius: "50%", background: "#dbeafe",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, fontWeight: 600, color: "#1d4ed8",
  },
  readMore: { fontSize: ".75rem", color: "#2563eb", fontWeight: 500, textDecoration: "none", display: "inline-block", marginTop: ".6rem" },
};