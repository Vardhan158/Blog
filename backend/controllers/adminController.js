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

// ✅ Delete a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Also delete all blogs and comments by this user
    await Blog.deleteMany({ userId });
    await Comment.deleteMany({ user: userId });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting user", error: err.message });
  }
};

// ✅ Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId) return res.status(400).json({ message: "Blog ID required" });

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // ✅ Also delete all comments on this blog
    await Comment.deleteMany({ blog: blogId });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting blog", error: err.message });
  }
};

// ✅ Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!commentId) return res.status(400).json({ message: "Comment ID required" });

    // ✅ First try to delete from Comment collection (newer comments)
    let deletedFromCollection = null;
    try {
      deletedFromCollection = await Comment.findByIdAndDelete(commentId);
    } catch (e) {
      console.log("Comment not in collection, checking embedded comments");
    }

    if (deletedFromCollection) {
      return res.json({ success: true, message: "Comment deleted successfully" });
    }

    // ✅ If not found, try to delete from embedded comments in blogs
    let deletedFromBlog = null;
    try {
      deletedFromBlog = await Blog.findOneAndUpdate(
        { "comments._id": commentId },
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );
    } catch (e) {
      console.log("Error updating blog:", e.message);
    }

    if (deletedFromBlog) {
      return res.json({ success: true, message: "Comment deleted successfully" });
    }

    // ✅ Not found in either location - return success anyway (it's already gone)
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ success: false, message: "Error deleting comment", error: err.message });
  }
};

module.exports = { getAdminDashboard, deleteUser, deleteBlog, deleteComment };
