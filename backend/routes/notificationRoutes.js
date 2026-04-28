const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  markNotificationsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/read", authMiddleware, markNotificationsRead);

module.exports = router;
