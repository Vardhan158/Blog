const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addComment, getComments } = require("../controllers/commentController");

// Add a comment
router.post("/", authMiddleware, addComment);

// Get all comments
router.get("/", authMiddleware, getComments);

// Get comments for a specific blog
router.get("/blog/:blogId", authMiddleware, getComments);

module.exports = router;
