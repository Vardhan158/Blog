const Blog = require("../models/Blog");
const User = require("../models/User");
const Comment = require("../models/Comment");
const cloudinary = require("../cloudinary");
const mongoose = require("mongoose");
const {
  createNotification,
  createNotificationsForRecipients,
} = require("./notificationController");

// Helper: Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogs", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Publish a new blog
const publishBlog = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "User not authorized" });
    if (!title || !category || !content)
      return res.status(400).json({ message: "Please fill in all required fields" });

    let featuredImageUrl = "";
    if (req.file) {
      const buffer = req.file.buffer || null;
      if (buffer) featuredImageUrl = await uploadToCloudinary(buffer);
      else if (req.file.path) featuredImageUrl = req.file.path;
    }

    const newBlog = await Blog.create({
      title,
      category,
      content,
      userId,
      featuredImage: featuredImageUrl,
      publishDate: new Date(),
      likes: [],
      comments: [],
    });

    await createNotification({
      recipient: userId,
      actor: userId,
      blog: newBlog._id,
      type: "post",
      message: `Your blog "${title}" was published successfully.`,
    });

    const recipients = await User.find({ _id: { $ne: userId } }).distinct("_id");
    await createNotificationsForRecipients({
      recipients,
      actor: userId,
      blog: newBlog._id,
      type: "post",
      message: `${req.user?.name || "Someone"} published a new blog "${title}".`,
    });

    res.status(201).json({ success: true, message: "Blog published successfully", blog: newBlog });
  } catch (err) {
    console.error("Error publishing blog:", err);
    res.status(500).json({ success: false, message: "Error publishing blog", error: err.message });
  }
};

// Get all blogs (public)
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email avatar profileImage"); // ✅ added profileImage
    res.json({ success: true, count: blogs.length, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching blogs", error: err.message });
  }
};

// Get blogs of logged-in user or specific user
const getUserBlogs = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    if (!userId) return res.status(400).json({ message: "User ID not provided" });
    const blogs = await Blog.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email avatar profileImage"); // ✅ added profileImage
    res.json({ success: true, count: blogs.length, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching user blogs", error: err.message });
  }
};

// Like or Unlike a blog
const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const index = blog.likes.findIndex((id) => id.toString() === userId.toString());
    const isNewLike = index === -1;
    if (isNewLike) blog.likes.push(userId);
    else blog.likes.splice(index, 1);

    await blog.save();

    if (isNewLike) {
      await createNotification({
        recipient: blog.userId,
        actor: userId,
        blog: blog._id,
        type: "like",
        message: `${req.user?.name || "Someone"} liked your blog "${blog.title}".`,
      });
    }

    res.status(200).json({ success: true, message: "Blog like updated", likesCount: blog.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating like", error: err.message });
  }
};

// Add a comment to a blog
const commentOnBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment } = req.body;
    const userId = req.user?._id;
    const userName = req.user?.name || "Anonymous";

    // ✅ Read profileImage first, avatar as fallback
    const avatar = req.user?.profileImage || req.user?.avatar || "";

    if (!userId) return res.status(401).json({ message: "Not authorized" });
    if (!comment || !comment.trim()) return res.status(400).json({ message: "Comment cannot be empty" });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ userId, userName, comment, avatar, createdAt: new Date() });
    await blog.save();

    await createNotification({
      recipient: blog.userId,
      actor: userId,
      blog: blog._id,
      type: "comment",
      message: `${userName} commented on your blog "${blog.title}".`,
    });

    res.json({ success: true, message: "Comment added successfully", commentsCount: blog.comments.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding comment", error: err.message });
  }
};

// Get single blog with related articles and comments
const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid blog ID" });

    // ✅ Added profileImage to populate
    const blog = await Blog.findById(id).populate("userId", "name email avatar profileImage");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const relatedArticles = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
    }).limit(3);

    // ✅ Fetch comments from Comment collection with full user data
    const comments = await Comment.find({ blog: id })
      .populate("user", "name avatar profileImage")
      .sort({ createdAt: -1 });

    res.json({ article: blog, relatedArticles, comments: comments || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching article", error: err.message });
  }
};

module.exports = { publishBlog, getBlogs, getUserBlogs, likeBlog, commentOnBlog, getSingleBlog };