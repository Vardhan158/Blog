import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { getToken } from "../utils/authStorage";

const API_URL = "https://blog-rsxx.onrender.com";
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const getProfilePic = (user) => {
  const image = user?.profileImage || user?.avatar || "";
  if (!image || image.trim() === "") return DEFAULT_AVATAR;
  if (image.startsWith("http")) return image;
  return `${API_URL}/uploads/${image.replace(/\\/g, "/")}`;
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .cm-root {
    --ink:    #1a1714;
    --ink2:   #4a4540;
    --ink3:   #8a847c;
    --ink4:   #b8b2a9;
    --paper:  #faf8f4;
    --paper2: #f2ede6;
    --rule:   #e0dbd2;
    --accent: #c0392b;
    background: var(--paper2);
    min-height: 200px;
    padding: clamp(32px, 6vw, 64px) clamp(20px, 5vw, 40px);
    font-family: 'DM Sans', sans-serif;
  }

  .cm-inner {
    max-width: 780px;
    margin: 0 auto;
  }

  /* ── Section heading ── */
  .cm-heading-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: clamp(20px, 4vw, 36px);
  }
  .cm-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(10px, 1.6vw, 11px);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink3);
    margin: 0;
    white-space: nowrap;
  }
  .cm-heading-line {
    flex: 1;
    height: 1px;
    background: var(--rule);
  }
  .cm-count {
    font-size: clamp(10px, 1.6vw, 11px);
    font-weight: 700;
    letter-spacing: .1em;
    background: var(--accent);
    color: #fff;
    padding: 2px 9px;
    border-radius: 2px;
    white-space: nowrap;
  }

  /* ── Cards ── */
  .cm-list {
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 2.5vw, 18px);
  }

  .cm-card {
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: clamp(14px, 3vw, 22px) clamp(16px, 3.5vw, 24px);
    animation: fadeUp 0.4s ease both;
    transition: box-shadow 0.22s cubic-bezier(.16,1,.3,1), transform 0.22s cubic-bezier(.16,1,.3,1);
  }
  .cm-card:hover {
    box-shadow: 0 8px 28px rgba(26,23,20,0.09);
    transform: translateY(-3px);
  }

  /* ── Card header ── */
  .cm-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .cm-user-row {
    display: flex;
    align-items: center;
    gap: clamp(10px, 2vw, 14px);
    min-width: 0;
  }
  .cm-avatar {
    width: clamp(34px, 6vw, 42px);
    height: clamp(34px, 6vw, 42px);
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid var(--rule);
    flex-shrink: 0;
  }
  .cm-user-name {
    margin: 0;
    font-weight: 600;
    color: var(--ink);
    font-size: clamp(13px, 2.2vw, 15px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cm-user-date {
    margin: 2px 0 0;
    font-size: clamp(10px, 1.6vw, 12px);
    color: var(--ink4);
  }

  /* ── Likes ── */
  .cm-likes {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .cm-heart {
    color: var(--accent);
    font-size: clamp(11px, 1.8vw, 13px);
  }
  .cm-likes-count {
    font-size: clamp(12px, 1.8vw, 14px);
    font-weight: 500;
    color: var(--ink3);
  }

  /* ── Comment text ── */
  .cm-text {
    font-size: clamp(14px, 2.2vw, 16px);
    line-height: 1.75;
    color: var(--ink2);
    margin: 0 0 12px;
    font-weight: 400;
  }

  /* ── Post reference ── */
  .cm-post-ref {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-top: 10px;
    border-top: 1px solid var(--rule);
    font-size: clamp(11px, 1.6vw, 12px);
    color: var(--ink4);
    letter-spacing: 0.04em;
  }
  .cm-post-ref-icon {
    font-size: 10px;
    opacity: 0.5;
    flex-shrink: 0;
  }
  .cm-post-title {
    font-weight: 600;
    color: var(--ink3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  /* ── States ── */
  .cm-state {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    padding: clamp(40px, 8vw, 72px) 0;
    color: var(--ink3);
    font-size: clamp(13px, 2.2vw, 15px);
  }
  .cm-state-icon {
    font-size: clamp(28px, 5vw, 36px);
  }
  .cm-state-error { color: var(--accent); }

  /* ── Skeleton ── */
  .cm-skel {
    background: var(--rule);
    border-radius: 2px;
    position: relative;
    overflow: hidden;
  }
  .cm-skel::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: shimmer 1.6s infinite;
  }
  .cm-skel-card {
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: 20px 24px;
    margin-bottom: 14px;
  }
`;

/* Skeleton card */
const SkeletonCard = ({ delay = 0 }) => (
  <div className="cm-skel-card" style={{ animationDelay: `${delay}ms` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div className="cm-skel" style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />
      <div>
        <div className="cm-skel" style={{ width: 110, height: 12, marginBottom: 7 }} />
        <div className="cm-skel" style={{ width: 70, height: 10 }} />
      </div>
    </div>
    <div className="cm-skel" style={{ width: "90%", height: 12, marginBottom: 9 }} />
    <div className="cm-skel" style={{ width: "70%", height: 12, marginBottom: 16 }} />
    <div className="cm-skel" style={{ width: 140, height: 10 }} />
  </div>
);

const Comment = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = blogId
          ? `${API_URL}/api/comments/${blogId}`
          : `${API_URL}/api/comments`;
        const res = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setComments(res.data || []);
      } catch (err) {
        console.error("Error fetching comments:", err.response?.data || err);
        setError(err.response?.data?.message || "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [blogId, token]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="cm-root">
        <div className="cm-inner">

          {/* Heading row */}
          <div className="cm-heading-row">
            <p className="cm-heading">Discussion</p>
            {!loading && !error && (
              <span className="cm-count">{comments.length}</span>
            )}
            <div className="cm-heading-line" />
          </div>

          {/* Loading */}
          {loading && (
            <div className="cm-list">
              {[0, 100, 200].map((d) => <SkeletonCard key={d} delay={d} />)}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="cm-state cm-state-error">
              <span className="cm-state-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && comments.length === 0 && (
            <div className="cm-state">
              <span className="cm-state-icon">💬</span>
              <span>No comments yet. Be the first!</span>
            </div>
          )}

          {/* Comments */}
          {!loading && !error && comments.length > 0 && (
            <div className="cm-list">
              {comments.map((comment, i) => {
                const userName = comment.user?.name || "Anonymous";
                const profilePic = getProfilePic(comment.user);
                const date = comment.createdAt
                  ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })
                  : "";

                return (
                  <div
                    key={comment._id}
                    className="cm-card"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Header */}
                    <div className="cm-card-header">
                      <div className="cm-user-row">
                        <img
                          src={profilePic}
                          alt={userName}
                          className="cm-avatar"
                          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <p className="cm-user-name">{userName}</p>
                          {date && <p className="cm-user-date">{date}</p>}
                        </div>
                      </div>
                      {comment.likes > 0 && (
                        <div className="cm-likes">
                          <FaHeart className="cm-heart" />
                          <span className="cm-likes-count">{comment.likes}</span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <p className="cm-text">{comment.text}</p>

                    {/* Post reference */}
                    <div className="cm-post-ref">
                      <span className="cm-post-ref-icon">↗</span>
                      <span style={{ flexShrink: 0 }}>On post:</span>
                      <span className="cm-post-title">
                        {comment.blog?.title || "Unknown post"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Comment;