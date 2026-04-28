const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const User = require("../models/User");

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, "").trim();

const getAdminDashboard = async (req, res) => {
  try {
    const [users, blogs, storedComments] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }).lean(),
      Blog.find().populate("userId", "name email avatar").sort({ createdAt: -1 }).lean(),
      Comment.find()
        .populate("user", "name email avatar")
        .populate("blog", "title")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const embeddedComments = blogs.flatMap((blog) =>
      (blog.comments || [])
        .filter((comment) => comment && typeof comment === "object" && (comment.comment || comment.text))
        .map((comment) => ({
          _id: comment._id,
          text: comment.comment || comment.text,
          createdAt: comment.createdAt,
          user: {
            _id: comment.userId,
            name: comment.userName || comment.name || "Anonymous",
            avatar: comment.avatar || "",
          },
          blog: {
            _id: blog._id,
            title: blog.title,
          },
          source: "embedded",
        }))
    );

    const comments = [
      ...storedComments.map((comment) => ({
        ...comment,
        source: "collection",
      })),
      ...embeddedComments,
    ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const formattedBlogs = blogs.map((blog) => ({
      ...blog,
      excerpt: stripHtml(blog.content).slice(0, 160),
      likesCount: Array.isArray(blog.likes) ? blog.likes.length : 0,
      commentsCount: Array.isArray(blog.comments) ? blog.comments.length : 0,
    }));

    res.json({
      success: true,
      stats: {
        blogs: blogs.length,
        users: users.length,
        comments: comments.length,
      },
      blogs: formattedBlogs,
      users,
      comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error loading admin dashboard",
      error: err.message,
    });
  }
};

module.exports = { getAdminDashboard };
