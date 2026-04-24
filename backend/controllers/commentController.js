const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// Add a comment to a blog
const addComment = async (req, res) => {
  try {
    const { blogId, text } = req.body;
    if (!blogId || !text) return res.status(400).json({ message: "All fields required" });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = await Comment.create({
      user: req.user._id,
      blog: blogId,
      text,
    });

    // ✅ Add comment reference to the blog
    blog.comments = blog.comments || [];
    blog.comments.push(comment._id);
    await blog.save();

    // Populate user info for frontend convenience
    await comment.populate("user", "name avatar");

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};


// Get comments for a specific blog or all comments
const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId) return res.status(400).json({ message: "Blog ID required" });

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "name avatar") // get user info
      .sort({ createdAt: -1 });
    console.log("Fetched comments:", comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};


module.exports = { addComment, getComments };
