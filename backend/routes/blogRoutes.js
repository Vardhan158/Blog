const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const {
  publishBlog,
  getBlogs,
  getUserBlogs,
  likeBlog,
  commentOnBlog,
  getSingleBlog,
} = require("../controllers/blogController");

// ======================= BLOG ROUTES =======================

// Publish a new blog (with optional image upload)
router.post("/publish", authMiddleware, upload.single("featuredImage"), publishBlog);

// Like or Unlike a blog
router.put("/like/:blogId", authMiddleware, likeBlog);

// Add a comment to a blog
router.post("/comment/:blogId", authMiddleware, commentOnBlog);

// Get all blogs (public)
router.get("/", getBlogs);

// Get blogs of logged-in user
router.get("/user", authMiddleware, getUserBlogs);

// Get blogs of a specific user
router.get("/user/:userId", authMiddleware, getUserBlogs);

// Get single blog with related articles and comments
router.get("/:id", getSingleBlog);

module.exports = router;