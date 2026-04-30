import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import DOMPurify from "dompurify";
import { getToken } from "../utils/authStorage";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const getProfilePic = (user, cachedImage = null) => {
  // ✅ Use cached image from userProfileImage field first (from comment timestamp)
  if (cachedImage && typeof cachedImage === "string" && cachedImage.trim()) {
    console.log("🖼️ Using cached image:", cachedImage);
    if (cachedImage.startsWith("http")) return cachedImage;
    return `https://blog-rsxx.onrender.com/uploads/${cachedImage.replace(/\\/g, "/")}`;
  }

  if (!user) {
    console.log("⚠️ No user object");
    return DEFAULT_AVATAR;
  }
  
  // ✅ Prioritize profileImage (which is always Cloudinary URL if available)
  const image = user?.profileImage || user?.avatar || "";
  if (!image || (typeof image === "string" && image.trim() === "")) {
    console.log("⚠️ No image in user object, using default");
    return DEFAULT_AVATAR;
  }
  
  // ✅ If it's already a full URL (Cloudinary or otherwise), use it directly
  if (typeof image === "string" && image.startsWith("http")) {
    console.log("🖼️ Using Cloudinary/full URL:", image);
    return image;
  }
  
  // ✅ Otherwise, construct the local URL
  const constructedUrl = `https://blog-rsxx.onrender.com/uploads/${String(image).replace(/\\/g, "/")}`;
  console.log("🖼️ Using constructed URL:", constructedUrl);
  return constructedUrl;
};

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
      const commentsData = Array.isArray(res.data.comments) ? res.data.comments : [];
      console.log("🔍 Comments data:", commentsData); // 🔍 Debug log
      setComments(commentsData);
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
    if (!token) {
      alert("Please log in to post a comment.");
      return;
    }
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  /* ── Loading skeleton ── */
  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#fafaf8" }}>
        <div style={{ width: "100%", height: "clamp(220px, 40vw, 420px)", background: "#e8e6e1", position: "relative", overflow: "hidden" }}>
          <div style={shimmerStyle} />
        </div>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(24px, 5vw, 56px) clamp(16px, 5vw, 32px)" }}>
          {[280, 200, 340, 260, 310, 190, 280].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? 14 : 13, width: w, background: "#e8e6e1", borderRadius: 4, marginBottom: 14, position: "relative", overflow: "hidden" }}>
              <div style={shimmerStyle} />
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <div style={{ fontSize: "clamp(48px, 10vw, 72px)", marginBottom: 16 }}>📄</div>
          <p style={{ color: "#c0392b", fontSize: "clamp(15px, 3vw, 17px)", fontFamily: "Georgia, serif" }}>{error}</p>
        </div>
      </div>
    </>
  );

  const readTime = article?.content
    ? Math.max(1, Math.ceil(article.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200))
    : 5;

  return (
    <>
      <Navbar />

      <div style={{ minHeight: "100vh", background: "#fafaf8", fontFamily: "'Georgia', serif" }}>

        {/* ── Hero ── */}
        <div style={{ position: "relative", width: "100%", height: "clamp(240px, 45vw, 480px)", overflow: "hidden" }}>
          <img
            src={article?.featuredImage || "https://source.unsplash.com/1600x600/?nature,technology"}
            alt={article?.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)"
          }} />
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", justifyContent: "flex-end",
            padding: "clamp(20px, 5vw, 48px) clamp(16px, 6vw, 64px) clamp(24px, 5vw, 48px)"
          }}>
            {article?.category && (
              <span style={{
                display: "inline-block", alignSelf: "flex-start",
                background: "#4f46e5", color: "white",
                fontSize: "clamp(10px, 2vw, 12px)", fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "4px 12px", borderRadius: 999,
                marginBottom: 12, fontFamily: "system-ui, sans-serif"
              }}>
                {article.category}
              </span>
            )}
            <h1 style={{
              color: "white", margin: 0,
              fontSize: "clamp(20px, 4.5vw, 42px)",
              fontWeight: 700, lineHeight: 1.2,
              maxWidth: 820,
              textShadow: "0 2px 12px rgba(0,0,0,0.3)"
            }}>
              {article?.title}
            </h1>
            {article?.subtitle && (
              <p style={{
                color: "rgba(255,255,255,0.82)", margin: "10px 0 0",
                fontSize: "clamp(13px, 2.5vw, 18px)",
                maxWidth: 640, lineHeight: 1.5,
                fontStyle: "italic"
              }}>
                {article.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>

          {/* Author bar */}
          <div style={{
            display: "flex", alignItems: "center", flexWrap: "wrap",
            gap: "clamp(8px, 2vw, 16px)",
            padding: "clamp(16px, 4vw, 28px) 0",
            borderBottom: "1px solid #e8e4dc"
          }}>
            {/* ✅ Author avatar uses getProfilePic */}
            <img
              src={getProfilePic(article?.userId)}
              alt={article?.userId?.name || "Author"}
              style={{ width: "clamp(36px, 7vw, 48px)", height: "clamp(36px, 7vw, 48px)", borderRadius: "50%", objectFit: "cover", border: "2px solid #e8e4dc", flexShrink: 0 }}
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, color: "#1a1a1a", fontFamily: "system-ui, sans-serif", fontSize: "clamp(13px, 2.5vw, 15px)" }}>
                {article?.userId?.name || "Anonymous"}
              </p>
              <p style={{ margin: 0, color: "#888", fontFamily: "system-ui, sans-serif", fontSize: "clamp(11px, 2vw, 13px)" }}>
                {article?.publishDate ? new Date(article.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                {" · "}{readTime} min read
              </p>
            </div>

            <button
              onClick={() => navigator.share?.({ title: article?.title, url: window.location.href })}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                border: "1px solid #d4d0c8", borderRadius: 999,
                padding: "6px 14px", background: "transparent",
                cursor: "pointer", fontFamily: "system-ui, sans-serif",
                fontSize: "clamp(11px, 2vw, 13px)", color: "#555",
                flexShrink: 0
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share
            </button>
          </div>

          {/* Article body */}
          <article
            style={{ padding: "clamp(24px, 5vw, 48px) 0 0" }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article?.content || "<p>Blog content...</p>"),
            }}
          />

          <style>{`
            article p { font-size: clamp(15px, 2.5vw, 18px); line-height: 1.85; color: #2c2c2c; margin-bottom: 1.5em; }
            article h2 { font-size: clamp(20px, 4vw, 28px); color: #111; margin: 2em 0 .6em; font-weight: 700; line-height: 1.25; }
            article h3 { font-size: clamp(17px, 3vw, 22px); color: #222; margin: 1.8em 0 .5em; font-weight: 700; }
            article img { max-width: 100%; border-radius: 10px; margin: 2em 0; display: block; }
            article blockquote { border-left: 4px solid #4f46e5; margin: 2em 0; padding: .5em 0 .5em 1.5em; font-style: italic; color: #555; background: #f4f3ff; border-radius: 0 8px 8px 0; }
            article ul, article ol { font-size: clamp(15px, 2.5vw, 18px); line-height: 1.8; color: #2c2c2c; padding-left: 1.5em; margin-bottom: 1.5em; }
            article li { margin-bottom: .4em; }
            article a { color: #4f46e5; text-decoration: underline; }
            article code { background: #f0eff5; border-radius: 4px; padding: 2px 6px; font-size: .88em; font-family: monospace; }
            article pre { background: #1e1e2e; color: #cdd6f4; padding: 1.2em 1.4em; border-radius: 10px; overflow-x: auto; margin: 1.5em 0; font-size: clamp(12px, 2vw, 14px); }
            article hr { border: none; border-top: 1px solid #e8e4dc; margin: 2.5em 0; }
          `}</style>

          <div style={{ borderTop: "1px solid #e8e4dc", margin: "clamp(32px, 6vw, 56px) 0 0" }} />

          {/* ── Related Articles ── */}
          {relatedArticles.length > 0 && (
            <section style={{ padding: "clamp(24px, 5vw, 48px) 0" }}>
              <h3 style={{
                fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 700,
                color: "#111", marginBottom: "clamp(16px, 3vw, 28px)",
                fontFamily: "system-ui, sans-serif"
              }}>
                Related Articles
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
                gap: "clamp(12px, 2.5vw, 20px)"
              }}>
                {relatedArticles.map((item) => (
                  <Link
                    to={`/article/${item._id}`}
                    key={item._id}
                    style={{
                      display: "block", background: "white",
                      borderRadius: 12, overflow: "hidden",
                      border: "1px solid #e8e4dc",
                      textDecoration: "none",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      style={{ width: "100%", height: "clamp(120px, 25vw, 150px)", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ padding: "clamp(10px, 2vw, 14px)" }}>
                      <h4 style={{
                        margin: 0, fontSize: "clamp(13px, 2vw, 15px)",
                        fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4,
                        fontFamily: "system-ui, sans-serif",
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden"
                      }}>
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Comments ── */}
          <section style={{ padding: "clamp(24px, 5vw, 48px) 0 clamp(40px, 8vw, 80px)" }}>
            <h3 style={{
              fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 700,
              color: "#111", marginBottom: "clamp(16px, 3vw, 24px)",
              fontFamily: "system-ui, sans-serif",
              display: "flex", alignItems: "center", gap: 10
            }}>
              Comments
              <span style={{
                background: "#4f46e5", color: "white",
                fontSize: "clamp(11px, 2vw, 13px)", fontWeight: 600,
                padding: "2px 10px", borderRadius: 999,
                fontFamily: "system-ui, sans-serif"
              }}>
                {comments.length}
              </span>
            </h3>

            {/* Comment input */}
            <div style={{
              display: "flex", gap: "clamp(8px, 2vw, 12px)",
              alignItems: "flex-start",
              marginBottom: "clamp(20px, 4vw, 32px)",
              flexWrap: "wrap"
            }}>
              <input
                type="text"
                placeholder={token ? "Share your thoughts..." : "Log in to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!token}
                style={{
                  flex: "1 1 200px", minWidth: 0,
                  padding: "clamp(10px, 2vw, 13px) clamp(12px, 2.5vw, 16px)",
                  border: "1.5px solid #ddd8d0", borderRadius: 10,
                  fontSize: "clamp(13px, 2.5vw, 15px)",
                  fontFamily: "system-ui, sans-serif",
                  background: token ? "white" : "#f5f4f2",
                  color: "#1a1a1a", outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#4f46e5"}
                onBlur={e => e.target.style.borderColor = "#ddd8d0"}
              />
              <button
                onClick={handleAddComment}
                disabled={!token || posting || !newComment.trim()}
                style={{
                  padding: "clamp(10px, 2vw, 13px) clamp(16px, 3vw, 24px)",
                  background: posting ? "#a5b4fc" : "#4f46e5",
                  color: "white", border: "none", borderRadius: 10,
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "clamp(13px, 2.5vw, 15px)", fontWeight: 600,
                  cursor: token && !posting ? "pointer" : "not-allowed",
                  opacity: !token || !newComment.trim() ? 0.6 : 1,
                  transition: "background 0.2s, transform 0.1s",
                  whiteSpace: "nowrap", flexShrink: 0
                }}
                onMouseEnter={e => { if (token && !posting) e.currentTarget.style.background = "#4338ca"; }}
                onMouseLeave={e => e.currentTarget.style.background = posting ? "#a5b4fc" : "#4f46e5"}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>

            {/* Comment list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 3vw, 24px)" }}>
              {comments.length > 0 ? (
                comments.map((comment) => {
                  console.log("📝 Comment object:", comment); // Debug each comment
                  return (
                  <div key={comment._id} style={{
                    display: "flex", gap: "clamp(10px, 2.5vw, 16px)",
                    padding: "clamp(12px, 2.5vw, 18px)",
                    background: "white", borderRadius: 12,
                    border: "1px solid #e8e4dc",
                    alignItems: "flex-start"
                  }}>
                    {/* ✅ Comment avatar uses getProfilePic with cached image for consistency */}
                    <img
                      src={getProfilePic(comment.user, comment.userProfileImage)}
                      alt={comment.user?.name || "User"}
                      style={{
                        width: "clamp(32px, 6vw, 40px)", height: "clamp(32px, 6vw, 40px)",
                        borderRadius: "50%", objectFit: "cover",
                        border: "2px solid #e8e4dc", flexShrink: 0
                      }}
                      onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        <p style={{
                          margin: 0, fontWeight: 700, color: "#1a1a1a",
                          fontFamily: "system-ui, sans-serif",
                          fontSize: "clamp(13px, 2.5vw, 14px)"
                        }}>
                          {comment.user?.name || comment.userName || "Anonymous"}
                        </p>
                        <small style={{ color: "#aaa", fontSize: "clamp(10px, 1.8vw, 12px)", fontFamily: "system-ui, sans-serif", flexShrink: 0 }}>
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                        </small>
                      </div>
                      <p style={{
                        margin: "4px 0 0", color: "#444",
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "clamp(13px, 2.5vw, 15px)",
                        lineHeight: 1.6, wordBreak: "break-word"
                      }}>
                        {comment.text || comment.comment}
                      </p>
                    </div>
                  </div>
                  );
                })
              ) : (
                <div style={{
                  textAlign: "center", padding: "clamp(28px, 6vw, 48px) 20px",
                  background: "white", borderRadius: 12, border: "1px solid #e8e4dc"
                }}>
                  <div style={{ fontSize: "clamp(28px, 6vw, 40px)", marginBottom: 10 }}>💬</div>
                  <p style={{ color: "#888", fontFamily: "system-ui, sans-serif", margin: 0, fontSize: "clamp(13px, 2.5vw, 15px)" }}>
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

const shimmerStyle = {
  position: "absolute", inset: 0,
  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
  animation: "shimmer 1.5s infinite",
};

export default BlogArticle;