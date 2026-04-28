const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getRandomAvatar = () => {
  // DiceBear example: returns a URL with a random seed
  const seed = Math.random().toString(36).substring(2, 10);
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${seed}`;
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
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
