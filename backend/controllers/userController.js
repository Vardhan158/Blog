// ======================= IMPORTS =======================
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import path from "path";
import cloudinary from "../cloudinary.js"; // Ensure cloudinary.js exports a configured instance

// ======================= HELPERS =======================
const getProfileImageUrl = (filename, req) => {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// ======================= UPLOAD PROFILE IMAGE =======================
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    let profileImageUrl = "";

    // ✅ Try uploading to Cloudinary (for buffer uploads)
    if (req.file.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      profileImageUrl = result.secure_url;
    } else if (req.file.path) {
      // ✅ Fallback for local uploads
      profileImageUrl = getProfileImageUrl(req.file.filename, req);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImageUrl },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile image updated successfully",
      user: {
        ...updatedUser.toObject(),
        profileImage: getProfileImageUrl(updatedUser.profileImage, req),
      },
    });
  } catch (err) {
    console.error("❌ Error uploading profile image:", err);
    res.status(500).json({ success: false, message: "Error uploading profile image" });
  }
};

// ======================= DASHBOARD SUMMARY =======================
export const getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    const recentBlogs = await Blog.find()
      .populate("userId", "name email profileImage")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentComments = [];
    const blogs = await Blog.find({}, { comments: 1, _id: 0 }).lean();
    blogs.forEach((b) => {
      if (b.comments) recentComments.push(...b.comments.slice(-2));
    });

    res.status(200).json({
      success: true,
      totalUsers,
      totalBlogs,
      recentBlogs,
      recentComments: recentComments.reverse(),
    });
  } catch (err) {
    console.error("❌ Error fetching dashboard summary:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard summary",
      error: err.message,
    });
  }
};

// ======================= DASHBOARD STATS =======================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    res.status(200).json({
      success: true,
      totalUsers,
      totalBlogs,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================= GET USER PROFILE =======================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        profileImage: getProfileImageUrl(user.profileImage, req),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Failed to load profile" });
  }
};

// ======================= UPDATE PROFILE INFO =======================
export const updateProfile = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, description },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...updatedUser.toObject(),
        profileImage: getProfileImageUrl(updatedUser.profileImage, req),
      },
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

// ======================= GET USER BLOGS =======================
export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate("author", "name email profileImage");

    const formattedBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title || "Untitled Blog",
      description: blog.description || "",
      likes: Array.isArray(blog.likes) ? blog.likes.length : 0,
      comments: Array.isArray(blog.comments) ? blog.comments.length : 0,
      createdAt: blog.createdAt,
    }));

    res.status(200).json({ success: true, blogs: formattedBlogs });
  } catch (err) {
    console.error("❌ Error fetching user blogs:", err);
    res.status(500).json({ success: false, message: "Error fetching user blogs" });
  }
};
