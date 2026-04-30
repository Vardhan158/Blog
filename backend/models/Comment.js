const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    text: { type: String, required: true },
    userProfileImage: { type: String }, // ✅ Cache user's profile image at time of comment
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
