const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const { createNotification } = require("./notificationController");

// Add a comment to a blog
const addComment = async (req, res) => {
  try {
    const { blogId, text } = req.body;
    if (!blogId || !text)
      return res.status(400).json({ message: "All fields required" });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // ✅ Get user's current profile image (Cloudinary URL or local path)
    const userProfileImage = req.user?.profileImage || req.user?.avatar || "";

    const comment = await Comment.create({
      user: req.user._id,
      blog: blogId,
      text,
      userProfileImage, // ✅ Store the profile image at time of comment
    });

    // Add comment reference to the blog
    blog.comments = blog.comments || [];
    blog.comments.push({
      userId: req.user._id,
      userName: req.user.name || req.user.username || "Anonymous",
      comment: text,
      createdAt: new Date(),
    });
    await blog.save();

    // ✅ Populate both avatar + profileImage so frontend always gets the image
    await comment.populate("user", "name avatar profileImage");
    await comment.populate("blog", "title");

    // ✅ Ensure userProfileImage is included in response
    const commentData = comment.toObject ? comment.toObject() : comment;
    
    await createNotification({
      recipient: blog.userId,
      actor: req.user._id,
      blog: blog._id,
      type: "comment",
      message: `${req.user.name || "Someone"} commented on your blog "${blog.title}".`,
    });

    res.status(201).json(commentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

// Get comments for a specific blog or all comments
const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId)
      return res.status(400).json({ message: "Blog ID required" });

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "name avatar profileImage") // ✅ Get current user data
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};

module.exports = { addComment, getComments };