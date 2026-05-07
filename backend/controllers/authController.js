const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail } = require("../utils/emailService");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getRandomAvatar = () => {
  // DiceBear example: returns a URL with a random seed
  const seed = Math.random().toString(36).substring(2, 10);
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${seed}`;
};

// Send OTP to email
exports.sendOTP = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if username is already taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP to email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    // Store OTP in database (overwrites if exists)
    await OTP.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "OTP sent successfully to your email",
      email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP and create user
exports.verifyOTPAndRegister = async (req, res) => {
  const { email, otp, username, password } = req.body;

  try {
    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new OTP." });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if user still doesn't exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate random avatar for new user
    const avatar = getRandomAvatar();

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      name: username,
      avatar,
    });

    // Delete OTP record after successful verification
    await OTP.deleteOne({ email });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        profileImage: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // generate a random avatar for new users
    const avatar = getRandomAvatar();

    const user = await User.create({ username, email, password, name: username, avatar });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        profileImage: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      // If avatar is empty, assign a random one
      if (!user.avatar && !user.profileImage) {
        user.avatar = getRandomAvatar();
        await user.save();
      }

      if (!user.avatar && user.profileImage) {
        user.avatar = user.profileImage;
        await user.save();
      }

      res.json({
        message: "Login successful",
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          profileImage: user.avatar,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
