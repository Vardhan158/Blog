const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail, verifyEmailConfig } = require("../utils/emailService");
const isProduction = process.env.NODE_ENV === "production";

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
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedUsername = username?.trim();

  try {
    if (!normalizedEmail || !normalizedUsername || !password) {
      return res.status(400).json({ message: "Email, username, and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if username is already taken
    const usernameExists = await User.findOne({ username: normalizedUsername });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database (overwrites if exists)
    await OTP.findOneAndUpdate(
      { email: normalizedEmail },
      { otp },
      { upsert: true, new: true }
    );

    const emailResult = await sendOTPEmail(normalizedEmail, otp);

    if (!emailResult.success) {
      await OTP.deleteOne({ email: normalizedEmail });
      const response = {
        message: "Failed to send OTP email. Please check your email configuration and try again.",
      };

      if (emailResult.errorCode) {
        response.errorCode = emailResult.errorCode;
      }

      if (!isProduction && emailResult.debug) {
        response.debug = emailResult.debug;
      }

      return res.status(500).json(response);
    }

    res.status(200).json({
      message: "OTP sent successfully to your email",
      email: normalizedEmail,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP and create user
exports.verifyOTPAndRegister = async (req, res) => {
  const { email, otp, username, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedUsername = username?.trim();

  try {
    // Find OTP record
    const otpRecord = await OTP.findOne({ email: normalizedEmail });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new OTP." });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if user still doesn't exist
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate random avatar for new user
    const avatar = getRandomAvatar();

    // Create user
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      name: normalizedUsername,
      avatar,
    });

    // Delete OTP record after successful verification
    await OTP.deleteOne({ email: normalizedEmail });

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

// Test email configuration
exports.testEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailConfigured = await verifyEmailConfig();

  if (!emailConfigured) {
    return res.status(400).json({
      message: "Email not configured. Please set your SMTP credentials.",
      configured: false,
    });
  }

  try {
    const testOTP = "123456";
    const emailResult = await sendOTPEmail(email.trim().toLowerCase(), testOTP);

    if (emailResult.success) {
      res.json({
        message: "Test email sent successfully!",
        configured: true,
        details: `Check ${email} for the test OTP (123456)`,
        messageId: emailResult.messageId,
      });
    } else {
      res.status(500).json({
        message: "Failed to send test email.",
        configured: false,
        errorCode: emailResult.errorCode,
        ...(!isProduction && emailResult.debug && { debug: emailResult.debug }),
      });
    }
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}`, configured: false });
  }
};
