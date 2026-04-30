import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import DOMPurify from "dompurify";
import { getToken } from "../utils/authStorage";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const getProfilePic = (user, cachedImage = null) => {
  if (cachedImage && typeof cachedImage === "string" && cachedImage.trim()) {
    if (cachedImage.startsWith("http")) return cachedImage;
    return `https://blog-rsxx.onrender.com/uploads/${cachedImage.replace(/\\/g, "/")}`;
  }
  if (!user) return DEFAULT_AVATAR;
  const image = user?.profileImage || user?.avatar || "";
  if (!image || (typeof image === "string" && image.trim() === "")) return DEFAULT_AVATAR;
  if (typeof image === "string" && image.startsWith("http")) return image;
  return `https://blog-rsxx.onrender.com/uploads/${String(image).replace(/\\/g, "/")}`;
};

/* ─── Shimmer keyframe injected once ─── */
const SHIMMER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  *, *::before, *::after { box-sizing: border-box; }

  .ba-root {
    --ink:       #1a1714;
    --ink-2:     #4a4540;
    --ink-3:     #8a847c;
    --ink-4:     #b8b2a9;
    --paper:     #faf8f4;
    --paper-2:   #f2ede6;
    --paper-3:   #e8e2d8;
    --accent:    #c0392b;
    --accent-2:  #e8604a;
    --rule:      #e0dbd2;
    font-family: 'Source Serif 4', Georgia, serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
  }

  /* ── Hero ── */
  .ba-hero {
    position: relative;
    width: 100%;
    height: clamp(280px, 55vw, 580px);
    overflow: hidden;
  }
  .ba-hero img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transform: scale(1.02);
    transition: transform 6s ease;
  }
  .ba-hero:hover img { transform: scale(1.05); }
  .ba-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      160deg,
      rgba(10,8,6,0.05) 0%,
      rgba(10,8,6,0.35) 50%,
      rgba(10,8,6,0.82) 100%
    );
  }
  .ba-hero-content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: flex-end;
    padding: clamp(24px, 5vw, 56px) clamp(20px, 6vw, 72px) clamp(28px, 5vw, 52px);
    animation: fadeUp 0.7s ease both;
  }
  .ba-category {
    display: inline-flex; align-self: flex-start;
    align-items: center; gap: 6px;
    background: var(--accent);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(10px, 1.6vw, 11px);
    font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 14px; border-radius: 2px;
    margin-bottom: 14px;
  }
  .ba-hero-title {
    font-family: 'Playfair Display', Georgia, serif;
    color: #fff; margin: 0;
    font-size: clamp(22px, 5vw, 52px);
    font-weight: 700; line-height: 1.15;
    max-width: 840px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.25);
    animation: fadeUp 0.7s 0.1s ease both;
  }
  .ba-hero-subtitle {
    color: rgba(255,255,255,0.78);
    margin: 12px 0 0;
    font-size: clamp(14px, 2.2vw, 19px);
    max-width: 620px; line-height: 1.55;
    font-style: italic; font-weight: 300;
    animation: fadeUp 0.7s 0.2s ease both;
  }

  /* ── Body wrapper ── */
  .ba-body {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 40px);
    animation: fadeIn 0.5s 0.3s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  /* ── Author bar ── */
  .ba-authorbar {
    display: flex; align-items: center;
    flex-wrap: wrap; gap: 14px;
    padding: clamp(18px, 4vw, 30px) 0;
    border-bottom: 1px solid var(--rule);
  }
  .ba-avatar {
    width: clamp(40px, 7vw, 52px);
    height: clamp(40px, 7vw, 52px);
    border-radius: 50%; object-fit: cover;
    border: 2px solid var(--rule);
    flex-shrink: 0;
  }
  .ba-author-name {
    margin: 0;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600; color: var(--ink);
    font-size: clamp(13px, 2.2vw, 15px);
  }
  .ba-author-meta {
    margin: 2px 0 0; color: var(--ink-3);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(11px, 1.8vw, 13px);
  }
  .ba-share-btn {
    margin-left: auto;
    display: flex; align-items: center; gap: 7px;
    border: 1.5px solid var(--paper-3);
    border-radius: 2px;
    padding: 7px 16px;
    background: transparent;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(11px, 1.8vw, 13px);
    font-weight: 500;
    color: var(--ink-2);
    flex-shrink: 0;
    transition: background 0.18s, border-color 0.18s, color 0.18s;
    white-space: nowrap;
  }
  .ba-share-btn:hover {
    background: var(--paper-2);
    border-color: var(--ink-3);
    color: var(--ink);
  }

  /* ── Article body ── */
  .ba-article {
    padding: clamp(28px, 5vw, 52px) 0 0;
  }
  .ba-article p  { font-size: clamp(16px, 2.2vw, 19px); line-height: 1.9; color: #2a2520; margin-bottom: 1.6em; font-weight: 300; }
  .ba-article h2 { font-family: 'Playfair Display', serif; font-size: clamp(22px, 4vw, 32px); color: var(--ink); margin: 2.2em 0 .6em; font-weight: 700; line-height: 1.2; }
  .ba-article h3 { font-family: 'Playfair Display', serif; font-size: clamp(18px, 3vw, 24px); color: var(--ink); margin: 1.8em 0 .5em; font-weight: 600; font-style: italic; }
  .ba-article img { max-width: 100%; border-radius: 4px; margin: 2.2em 0; display: block; height: auto; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
  .ba-article blockquote {
    border-left: 3px solid var(--accent);
    margin: 2.2em 0; padding: .8em 0 .8em 1.6em;
    font-style: italic; color: var(--ink-2);
    font-size: clamp(17px, 2.5vw, 21px);
    font-family: 'Playfair Display', serif;
    background: none;
  }
  .ba-article ul, .ba-article ol { font-size: clamp(16px, 2.2vw, 19px); line-height: 1.85; color: #2a2520; padding-left: 1.6em; margin-bottom: 1.6em; font-weight: 300; }
  .ba-article li { margin-bottom: .5em; }
  .ba-article a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 3px; }
  .ba-article code { background: var(--paper-2); border-radius: 3px; padding: 2px 7px; font-size: .85em; font-family: 'Fira Code', 'Courier New', monospace; word-break: break-word; color: var(--accent); }
  .ba-article pre { background: #18160f; color: #e8e0d0; padding: 1.4em 1.6em; border-radius: 4px; overflow-x: auto; margin: 1.8em 0; font-size: clamp(12px, 1.8vw, 14px); }
  .ba-article hr { border: none; border-top: 1px solid var(--rule); margin: 2.8em 0; }
  .ba-article table { width: 100%; border-collapse: collapse; margin: 1.8em 0; font-size: clamp(13px, 2vw, 16px); }
  .ba-article th, .ba-article td { border: 1px solid var(--rule); padding: .8em 1em; text-align: left; }
  .ba-article th { background: var(--paper-2); font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: .92em; letter-spacing: .04em; }

  /* ── Divider ── */
  .ba-divider {
    border: none;
    display: flex; align-items: center; gap: 12px;
    margin: clamp(36px, 6vw, 60px) 0 0;
  }
  .ba-divider::before, .ba-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--rule);
  }
  .ba-divider-icon { color: var(--ink-4); font-size: 18px; flex-shrink: 0; }

  /* ── Related Articles ── */
  .ba-related { padding: clamp(28px, 5vw, 52px) 0; }
  .ba-section-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(11px, 1.8vw, 12px);
    font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin: 0 0 clamp(18px, 3vw, 30px);
    display: flex; align-items: center; gap: 12px;
  }
  .ba-section-heading::after {
    content: ''; flex: 1; height: 1px; background: var(--rule);
  }
  .ba-related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
    gap: clamp(14px, 2.5vw, 22px);
  }
  .ba-related-card {
    display: block; background: white;
    border: 1px solid var(--rule);
    text-decoration: none;
    transition: transform 0.22s cubic-bezier(.16,1,.3,1), box-shadow 0.22s;
    overflow: hidden;
  }
  .ba-related-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(26,23,20,0.10);
  }
  .ba-related-card img {
    width: 100%; height: clamp(110px, 22vw, 140px);
    object-fit: cover; display: block;
    transition: transform 0.4s ease;
  }
  .ba-related-card:hover img { transform: scale(1.04); }
  .ba-related-card-body { padding: clamp(10px, 2vw, 16px); }
  .ba-related-card h4 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: clamp(13px, 1.8vw, 15px);
    font-weight: 600; color: var(--ink); line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  /* ── Comments ── */
  .ba-comments { padding: clamp(28px, 5vw, 52px) 0 clamp(48px, 9vw, 96px); }
  .ba-comment-count {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(11px, 1.8vw, 12px);
    font-weight: 700; letter-spacing: .1em;
    background: var(--accent); color: #fff;
    padding: 2px 9px; border-radius: 2px;
    vertical-align: middle;
    margin-left: 2px;
  }
  .ba-comment-input-row {
    display: flex; gap: clamp(8px, 2vw, 12px);
    align-items: stretch;
    margin-bottom: clamp(24px, 4vw, 36px);
    flex-wrap: wrap;
  }
  .ba-comment-input {
    flex: 1 1 200px; min-width: 0;
    padding: clamp(11px, 2vw, 14px) clamp(14px, 2.5vw, 18px);
    border: 1.5px solid var(--paper-3);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(13px, 2.2vw, 15px);
    color: var(--ink); outline: none;
    background: white;
    border-radius: 2px;
    transition: border-color 0.18s;
    min-height: 46px;
  }
  .ba-comment-input:disabled { background: var(--paper-2); color: var(--ink-3); }
  .ba-comment-input:focus { border-color: var(--accent); }
  .ba-comment-btn {
    padding: clamp(11px, 2vw, 14px) clamp(20px, 3.5vw, 28px);
    background: var(--ink);
    color: #faf8f4; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(13px, 2.2vw, 15px); font-weight: 600;
    cursor: pointer; flex-shrink: 0;
    border-radius: 2px;
    min-height: 46px;
    letter-spacing: .04em;
    transition: background 0.18s, transform 0.12s;
    display: flex; align-items: center; justify-content: center;
    white-space: nowrap;
  }
  .ba-comment-btn:hover:not(:disabled) { background: var(--accent); }
  .ba-comment-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .ba-comment-btn:active:not(:disabled) { transform: scale(0.98); }

  .ba-comment-list { display: flex; flex-direction: column; gap: clamp(14px, 3vw, 20px); }
  .ba-comment-item {
    display: flex; gap: clamp(12px, 2.5vw, 18px);
    padding: clamp(14px, 3vw, 20px);
    background: white;
    border: 1px solid var(--rule);
    align-items: flex-start;
  }
  .ba-comment-avatar {
    width: clamp(32px, 5.5vw, 42px);
    height: clamp(32px, 5.5vw, 42px);
    border-radius: 50%; object-fit: cover;
    border: 1.5px solid var(--rule); flex-shrink: 0;
  }
  .ba-comment-user {
    margin: 0; font-family: 'DM Sans', sans-serif;
    font-weight: 600; color: var(--ink);
    font-size: clamp(13px, 2vw, 14px);
  }
  .ba-comment-date {
    color: var(--ink-4);
    font-size: clamp(10px, 1.6vw, 12px);
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0; white-space: nowrap;
    margin-left: auto;
  }
  .ba-comment-text {
    margin: 5px 0 0; color: var(--ink-2);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(13px, 2.2vw, 15px);
    line-height: 1.65; word-break: break-word;
  }
  .ba-empty-comments {
    text-align: center;
    padding: clamp(32px, 6vw, 52px) 20px;
    background: white;
    border: 1px solid var(--rule);
  }
  .ba-empty-icon { font-size: clamp(28px, 5vw, 38px); margin-bottom: 10px; }
  .ba-empty-text {
    color: var(--ink-3);
    font-family: 'DM Sans', sans-serif;
    margin: 0; font-size: clamp(13px, 2.2vw, 15px);
  }

  /* ── Skeleton ── */
  .ba-skel { background: var(--paper-2); border-radius: 3px; position: relative; overflow: hidden; }
  .ba-skel::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
    animation: shimmer 1.6s infinite;
  }
  .ba-error-wrap {
    min-height: 100vh; background: var(--paper);
    display: flex; align-items: center; justify-content: center;
  }
  .ba-error-inner { text-align: center; padding: 0 24px; }
  .ba-error-msg {
    color: var(--accent);
    font-size: clamp(15px, 2.5vw, 17px);
    font-family: 'DM Sans', sans-serif;
  }
`;

const BlogArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const token = getToken();

  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

  const fetchArticleData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/blogs/${id}`);
      setArticle(res.data.article);
      setRelatedArticles(res.data.relatedArticles || []);
      setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching article");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchArticleData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!token) { alert("Please log in to post a comment."); return; }
    try {
      setPosting(true);
      const res = await axios.post(
        `${API_URL}/api/comments`,
        { blogId: id, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); }
  };

  /* ── Skeleton ── */
  if (loading) return (
    <>
      <style>{SHIMMER_CSS}</style>
      <Navbar />
      <div className="ba-root">
        <div className="ba-skel" style={{ width: "100%", height: "clamp(280px, 55vw, 580px)" }} />
        <div className="ba-body" style={{ opacity: 1 }}>
          <div style={{ padding: "28px 0 20px", display: "flex", gap: 14, alignItems: "center" }}>
            <div className="ba-skel" style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="ba-skel" style={{ height: 13, width: 140, marginBottom: 8 }} />
              <div className="ba-skel" style={{ height: 11, width: 100 }} />
            </div>
          </div>
          {[340, 310, 380, 260, 330, 200, 290, 350, 220, 300].map((w, i) => (
            <div key={i} className="ba-skel" style={{ height: 14, width: w, marginBottom: 16, maxWidth: "100%" }} />
          ))}
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{SHIMMER_CSS}</style>
      <Navbar />
      <div className="ba-root ba-error-wrap">
        <div className="ba-error-inner">
          <div style={{ fontSize: "clamp(48px, 10vw, 72px)", marginBottom: 16 }}>📄</div>
          <p className="ba-error-msg">{error}</p>
        </div>
      </div>
    </>
  );

  const readTime = article?.content
    ? Math.max(1, Math.ceil(article.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200))
    : 5;

  const publishDate = article?.publishDate
    ? new Date(article.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <Navbar />

      <div className="ba-root">

        {/* ── Hero ── */}
        <div className="ba-hero">
          <img
            src={article?.featuredImage || "https://source.unsplash.com/1600x600/?nature,technology"}
            alt={article?.title}
          />
          <div className="ba-hero-overlay" />
          <div className="ba-hero-content">
            {article?.category && (
              <span className="ba-category">{article.category}</span>
            )}
            <h1 className="ba-hero-title">{article?.title}</h1>
            {article?.subtitle && (
              <p className="ba-hero-subtitle">{article.subtitle}</p>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ba-body">

          {/* Author bar */}
          <div className="ba-authorbar">
            <img
              src={getProfilePic(article?.userId)}
              alt={article?.userId?.name || "Author"}
              className="ba-avatar"
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="ba-author-name">{article?.userId?.name || "Anonymous"}</p>
              <p className="ba-author-meta">
                {publishDate}{publishDate && " · "}{readTime} min read
              </p>
            </div>
            <button
              className="ba-share-btn"
              onClick={() => navigator.share?.({ title: article?.title, url: window.location.href })}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share
            </button>
          </div>

          {/* Article body */}
          <article
            className="ba-article"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article?.content || "<p>Blog content...</p>"),
            }}
          />

          {/* Ornamental divider */}
          <div className="ba-divider">
            <span className="ba-divider-icon">✦</span>
          </div>

          {/* ── Related Articles ── */}
          {relatedArticles.length > 0 && (
            <section className="ba-related">
              <p className="ba-section-heading">More to read</p>
              <div className="ba-related-grid">
                {relatedArticles.map((item) => (
                  <Link to={`/article/${item._id}`} key={item._id} className="ba-related-card">
                    <div style={{ overflow: "hidden" }}>
                      <img src={item.featuredImage} alt={item.title} />
                    </div>
                    <div className="ba-related-card-body">
                      <h4>{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Comments ── */}
          <section className="ba-comments">
            <p className="ba-section-heading">
              Discussion <span className="ba-comment-count">{comments.length}</span>
            </p>

            {/* Input */}
            <div className="ba-comment-input-row">
              <input
                type="text"
                className="ba-comment-input"
                placeholder={token ? "Share your thoughts…" : "Log in to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!token}
              />
              <button
                className="ba-comment-btn"
                onClick={handleAddComment}
                disabled={!token || posting || !newComment.trim()}
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>

            {/* List */}
            <div className="ba-comment-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="ba-comment-item">
                    <img
                      src={getProfilePic(comment.user, comment.userProfileImage)}
                      alt={comment.user?.name || "User"}
                      className="ba-comment-avatar"
                      onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                        <p className="ba-comment-user">
                          {comment.user?.name || comment.userName || "Anonymous"}
                        </p>
                        <small className="ba-comment-date">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : ""}
                        </small>
                      </div>
                      <p className="ba-comment-text">{comment.text || comment.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="ba-empty-comments">
                  <div className="ba-empty-icon">💬</div>
                  <p className="ba-empty-text">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BlogArticle;