const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getAdminDashboard, deleteUser, deleteBlog, deleteComment } = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", authMiddleware, adminMiddleware, getAdminDashboard);

// ✅ Delete routes
router.delete("/user/:userId", authMiddleware, adminMiddleware, deleteUser);
router.delete("/blog/:blogId", authMiddleware, adminMiddleware, deleteBlog);
router.delete("/comment/:commentId", authMiddleware, adminMiddleware, deleteComment);

module.exports = router;
