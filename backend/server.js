require("dotenv").config(); // MUST be on top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ======================= MIDDLEWARES =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================= ROUTES =======================
app.use("/auth", authRoutes);
app.use("/api/blogs", blogRoutes);        // Blog endpoints
app.use("/api/comments", commentRoutes);  // Comment endpoints
app.use("/api/user", userRoutes);         // User endpoints
app.use("/api/blogs", blogRoutes); // All blog routes are now /api/blogs/*

// ======================= MONGODB CONNECTION =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ======================= START SERVER =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
