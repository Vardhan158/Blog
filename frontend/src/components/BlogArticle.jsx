import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import DOMPurify from "dompurify";
import { getToken } from "../utils/authStorage";

const BlogArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const token = getToken();

  const API_URL = import.meta.env.VITE_API_URL || "https://blog-rsxx.onrender.com";

  // Fetch article data
  const fetchArticleData = async () => {
    try {
      console.log("Fetching article...");
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/blogs/${id}`);
      console.log("Article response:", res.data);
      setArticle(res.data.article);
      setRelatedArticles(res.data.relatedArticles || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching article:", err);
      setError(err.response?.data?.message || "Error fetching article");
      setLoading(false);
    }
  };

  // Fetch comments for this blog
  const fetchComments = async () => {
    try {
      console.log("Fetching comments...");
      const res = await axios.get(`${API_URL}/api/comments/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Comments fetched:", res.data);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticleData();
      fetchComments();
    }
  }, [id]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log("Adding comment:", newComment);
      const res = await axios.post(
        `${API_URL}/api/comments`,
        { blogId: id, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("New comment response:", res.data);
      setComments((prev) => [res.data, ...prev]); // add to state
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading article...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gray-900">
          <img
            src={article?.featuredImage || "https://source.unsplash.com/1600x600/?nature,technology"}
            alt="Blog Hero"
            className="w-full h-64 md:h-80 object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-snug mb-3">
              {article?.title || "Blog Title"}
            </h1>
            <p className="text-gray-200 text-base md:text-lg max-w-2xl">
              {article?.subtitle || ""}
            </p>
          </div>
        </section>

        {/* Article Content */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          {/* Author Info */}
          <div className="flex items-center mb-8">
            <img
              src={article?.userId?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt={article?.userId?.name || "Author"}
              className="w-12 h-12 rounded-full mr-4 border border-gray-200"
            />
            <div>
              <p className="text-gray-800 font-semibold">{article?.userId?.name || "John Doe"}</p>
              <p className="text-gray-500 text-sm">
                {article?.publishDate ? new Date(article.publishDate).toDateString() : "October 10, 2025"} · 8 min read
              </p>
            </div>
          </div>

          {/* Main Article */}
          <article
            className="prose prose-gray prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article?.content || "<p>Blog content...</p>"),
            }}
          />

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <h3 className="text-2xl font-semibold mb-8 text-gray-800">Related Articles</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedArticles.map((item) => (
                  <Link
                    to={`/article/${item._id}`}
                    key={item._id}
                    className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300"
                  >
                    <img src={item.featuredImage} alt={item.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 hover:text-indigo-600 transition">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Comments Section */}
          <section className="mt-16">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Comments</h3>

            {/* Add Comment */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Post
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-4">
                    <img
                      src={comment.user?.avatar || "https://randomuser.me/api/portraits/men/45.jpg"}
                      alt={comment.user?.name || "User"}
                      className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <div>
                      <p className="text-gray-800 font-semibold">{comment.user?.name || "Anonymous"}</p>
                      <p className="text-gray-600 text-sm">{comment.text}</p>
                      <small className="text-gray-400 text-xs">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </section>
        </section>
      </div>
    </>
  );
};

export default BlogArticle;
