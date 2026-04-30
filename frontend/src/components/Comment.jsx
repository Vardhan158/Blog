import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { getToken } from "../utils/authStorage";

const API_URL = "https://blog-rsxx.onrender.com";
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

// ✅ profileImage first (latest Cloudinary upload), avatar as fallback
const getProfilePic = (user) => {
  const image = user?.profileImage || user?.avatar || "";
  if (!image || image.trim() === "") return DEFAULT_AVATAR;
  if (image.startsWith("http")) return image;
  return `${API_URL}/uploads/${image.replace(/\\/g, "/")}`;
};

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

  if (loading)
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
        Loading comments...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12 text-red-500 text-sm">
        {error}
      </div>
    );

  if (comments.length === 0)
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
        No comments yet.
      </div>
    );

  return (
    <div className="bg-gray-50 px-4 sm:px-6 py-8 sm:py-10">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6 text-center">
          Comments Received
        </h2>

        <div className="flex flex-col gap-4 sm:gap-6">
          {comments.map((comment) => {
            const userName = comment.user?.name || "Anonymous";
            const profilePic = getProfilePic(comment.user); // ✅ full user object

            return (
              <div
                key={comment._id}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header: avatar + name + likes */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={profilePic}
                      alt={userName}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200 shrink-0"
                      onError={(e) => {
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {userName}
                      </h3>
                      {comment.createdAt && (
                        <p className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Likes */}
                  <div className="flex items-center gap-1.5 text-red-500 text-sm shrink-0 mt-1">
                    <FaHeart className="text-xs sm:text-sm" />
                    <span>{comment.likes || 0}</span>
                  </div>
                </div>

                {/* Comment text */}
                <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                  {comment.text}
                </p>

                {/* Blog title */}
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  On Post:{" "}
                  <span className="text-gray-500 font-medium">
                    {comment.blog?.title || "Unknown post"}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Comment;