require("dotenv").config(); // MUST be on top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const seedAdmin = require("./utils/seedAdmin");
const { setSocketServer } = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
  },
});

setSocketServer(io);

io.on("connection", (socket) => {
  socket.on("join-user", (userId) => {
    if (userId) socket.join(`user:${userId}`);
  });
});

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
app.use("/api/admin", adminRoutes);       // Admin endpoints
app.use("/api/notifications", notificationRoutes);
app.use("/api/blogs", blogRoutes); // All blog routes are now /api/blogs/*

// ======================= MONGODB CONNECTION =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedAdmin();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// ======================= START SERVER =======================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
