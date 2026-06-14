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
const { verifyEmailConfig } = require("./utils/emailService");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://blog-frontend-8d5p.onrender.com",
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

setSocketServer(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-user", (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`User joined room: user:${userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedAdmin();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
  
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Verify email configuration
  await verifyEmailConfig();
});
