const User = require("../models/User");
const Blog = require("../models/Blog");
const cloudinary = require("../cloudinary");
const { publicVapidKey } = require("../utils/webPush");

const getProfileImageUrl = (image, req) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${req.protocol}://${req.get("host")}/uploads/${image}`;
};

const formatUser = (user, req) => {
  const rawUser = user.toObject ? user.toObject() : user;
  const imageUrl = getProfileImageUrl(rawUser.avatar || rawUser.profileImage, req);

  return {
    ...rawUser,
    avatar: imageUrl,
    profileImage: imageUrl,
  };
};

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "profiles", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    let imageUrl = "";
    if (req.file.buffer) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    } else if (req.file.filename) {
      imageUrl = getProfileImageUrl(req.file.filename, req);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: imageUrl, profileImage: imageUrl },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      message: "Profile image updated successfully",
      user: formatUser(updatedUser, req),
    });
  } catch (err) {
    console.error("Error uploading profile image:", err);
    res.status(500).json({ success: false, message: "Error uploading profile image" });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    const recentBlogs = await Blog.find()
      .populate("userId", "name email avatar profileImage")
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
    console.error("Error fetching dashboard summary:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard summary",
      error: err.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    res.status(200).json({
      success: true,
      totalUsers,
      totalBlogs,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: formatUser(user, req),
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Failed to load profile" });
  }
};

const updateProfile = async (req, res) => {
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
      user: formatUser(updatedUser, req),
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate("author", "name email avatar profileImage");

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
    console.error("Error fetching user blogs:", err);
    res.status(500).json({ success: false, message: "Error fetching user blogs" });
  }
};

const subscribeToPush = async (req, res) => {
  try {
    const subscription = req.body;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json({ success: false, message: "Invalid push subscription" });
    }

    await User.updateMany(
      { "pushSubscriptions.endpoint": subscription.endpoint },
      { $pull: { pushSubscriptions: { endpoint: subscription.endpoint } } }
    );

    await User.updateOne(
      { _id: req.user._id },
      { $push: { pushSubscriptions: subscription } }
    );

    res.json({ success: true, message: "Push subscription saved" });
  } catch (err) {
    console.error("Error saving push subscription:", err);
    res.status(500).json({ success: false, message: "Error saving push subscription" });
  }
};

const unsubscribeFromPush = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ success: false, message: "Subscription endpoint is required" });
    }

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { pushSubscriptions: { endpoint } } }
    );

    res.json({ success: true, message: "Push subscription removed" });
  } catch (err) {
    console.error("Error removing push subscription:", err);
    res.status(500).json({ success: false, message: "Error removing push subscription" });
  }
};

const getPushPublicKey = async (req, res) => {
  res.json({ success: true, publicKey: publicVapidKey });
};

module.exports = {
  uploadProfileImage,
  getDashboardSummary,
  getDashboardStats,
  getProfile,
  updateProfile,
  getUserBlogs,
  subscribeToPush,
  unsubscribeFromPush,
  getPushPublicKey,
};
