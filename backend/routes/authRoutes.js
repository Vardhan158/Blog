const express = require("express");
const { registerUser, loginUser, sendOTP, verifyOTPAndRegister } = require("../controllers/authController");
const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPAndRegister);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
