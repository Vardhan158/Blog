const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  featuredImage: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: String,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true }); // optional, adds createdAt & updatedAt

// ✅ Create the model and export it
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
