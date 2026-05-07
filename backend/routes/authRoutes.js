const express = require("express");
const { registerUser, loginUser, sendOTP, verifyOTPAndRegister, testEmail } = require("../controllers/authController");
const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPAndRegister);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/test-email", testEmail); // For debugging email configuration

module.exports = router;
