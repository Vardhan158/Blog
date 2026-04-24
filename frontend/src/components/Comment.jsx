import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";

const Comment = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // get JWT token

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = blogId
          ? `http://localhost:5000/api/comments/${blogId}` 
          : "http://localhost:5000/api/comments"; 

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
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading comments...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (comments.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No comments yet.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Comments Received
        </h2>

        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-800">{comment.userName}</h3>
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <FaHeart /> {comment.likes || 0}
                </div>
              </div>
              <p className="text-gray-600 mb-2">{comment.text}</p>
              <span className="text-gray-400 text-sm">
                On Post: {comment.blogTitle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
