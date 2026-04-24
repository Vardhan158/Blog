const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadProfileImage,
  getProfile,
  updateProfile,
  getUserBlogs,
} = require("../controllers/userController");

const router = express.Router();

// ======================= Ensure Uploads Folder Exists =======================
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads folder");
}

// ======================= Multer Configuration =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// Optional: file type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, and WEBP files are allowed"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

// ======================= Routes =======================

// ✅ Upload Profile Image (with auth + multer)
router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage
);

// ✅ Get logged-in user profile
router.get("/profile", authMiddleware, getProfile);

// ✅ Update profile info (name, description)
router.put("/update", authMiddleware, updateProfile);

// ✅ Get user blogs (user dashboard)
router.get("/user-blogs", authMiddleware, getUserBlogs);

// ======================= Export =======================
module.exports = router;
