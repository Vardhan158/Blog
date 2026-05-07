const { Resend } = require("resend");

const isProduction = process.env.NODE_ENV === "production";
let resend;

const initializeResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY not configured");
    return null;
  }
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("✅ Resend email service initialized");
  return resend;
};

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  if (!resend) {
    resend = initializeResend();
  }

  if (!resend) {
    console.error("❌ Resend not configured. Please set RESEND_API_KEY.");
    return {
      success: false,
      message: "Email service not configured.",
      debug: isProduction ? undefined : "RESEND_API_KEY is missing.",
    };
  }

  try {
    console.log(`📧 Sending OTP to ${email}...`);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Replace with your domain once verified e.g. "noreply@yourdomain.com"
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
    });

    if (error) {
      console.error(`❌ Resend error sending to ${email}:`);
      console.error(`   Error: ${error.message}`);
      return {
        success: false,
        message: "Failed to send email.",
        errorCode: error.name,
        debug: isProduction ? undefined : error.message,
      };
    }

    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log(`   Message ID: ${data.id}`);
    return {
      success: true,
      messageId: data.id,
    };
  } catch (err) {
    console.error(`❌ Exception sending OTP email to ${email}`);
    console.error(`   Error: ${err.message}`);
    return {
      success: false,
      message: "Failed to send email.",
      errorCode: err.code,
      debug: isProduction ? undefined : err.message,
    };
  }
};

// Verify email configuration on startup
const verifyEmailConfig = async () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  WARNING: RESEND_API_KEY not configured. OTP emails will NOT be sent.");
    return false;
  }

  try {
    console.log("🔍 Verifying Resend configuration...");
    resend = initializeResend();

    if (!resend) {
      console.error("❌ Failed to initialize Resend");
      return false;
    }

    console.log("✅ Resend email service ready");
    console.log(`   Sending emails via Resend API`);
    return true;
  } catch (err) {
    console.error("❌ Resend configuration check failed:");
    console.error(`   Error: ${err.message}`);
    return false;
  }
};

module.exports = { generateOTP, sendOTPEmail, verifyEmailConfig };