const nodemailer = require("nodemailer");

// Create transporter
let transporter;

const initializeTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  EMAIL_USER or EMAIL_PASS not configured in .env file");
    return null;
  }

  const emailPass = process.env.EMAIL_PASS.replace(/\s+/g, ""); // Remove all spaces from app password

  console.log("🔧 Initializing email service...");
  console.log(`   Service: ${process.env.EMAIL_SERVICE}`);
  console.log(`   User: ${process.env.EMAIL_USER}`);

  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: emailPass,
    },
  });

  console.log("✅ Email transporter created");
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
    text: `Your OTP is: ${otp}. Valid for 10 minutes.`,
  };

  try {
    console.log(`📧 Sending OTP to ${email}...`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log(`   Message ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending OTP email to ${email}`);
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Error Message: ${error.message}`);
    if (error.response) {
      console.error(`   SMTP Response: ${error.response}`);
    }
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
    console.log("🔍 Verifying email configuration...");
    transporter = initializeTransporter();
    
    if (!transporter) {
      console.error("❌ Failed to initialize transporter");
      return false;
    }

    await transporter.verify();
    console.log("✅ Email configuration verified successfully");
    console.log(`   Ready to send emails from: ${process.env.EMAIL_USER}`);
    return true;
  } catch (error) {
    console.error("❌ Email configuration verification failed:");
    console.error(`   Error: ${error.message}`);
    console.error(`   This usually means invalid email credentials`);
    return false;
  }
};

module.exports = { generateOTP, sendOTPEmail, verifyEmailConfig };
