const nodemailer = require("nodemailer");

// Create transporter
let transporter;

const initializeTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  EMAIL_USER or EMAIL_PASS not configured in .env file");
    return null;
  }

  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("✅ Email service initialized");
  return transporter;
};

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  if (!transporter) {
    transporter = initializeTransporter();
  }

  if (!transporter) {
    console.error("❌ Email transporter not configured. Please set EMAIL_USER and EMAIL_PASS in .env");
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <h2 style="color: #1e293b; margin-bottom: 20px;">Email Verification</h2>
        <p style="color: #475569; font-size: 16px; margin-bottom: 20px;">
          Thank you for signing up! Please use the following OTP to verify your email address:
        </p>
        <div style="background-color: #fff; border: 2px solid #6366f1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #6366f1; letter-spacing: 2px; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">
          This OTP is valid for 10 minutes only.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
          If you did not request this email, you can safely ignore it.
        </p>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending OTP email to ${email}:`, error.message);
    return false;
  }
};

// Verify email configuration on startup
const verifyEmailConfig = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  WARNING: Email credentials not configured. OTP emails will NOT be sent.");
    return false;
  }

  try {
    transporter = initializeTransporter();
    await transporter.verify();
    console.log("✅ Email configuration verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    return false;
  }
};

module.exports = { generateOTP, sendOTPEmail, verifyEmailConfig };
