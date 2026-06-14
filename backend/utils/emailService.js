const nodemailer = require("nodemailer");
const axios = require("axios");

let transporter;
const isProduction = process.env.NODE_ENV === "production";

/**
 * Priority 1: Brevo API (Recommended for Render)
 * Priority 2: Brevo SMTP (Fallback)
 */

const getFromAddress = () => {
  return process.env.BREVO_FROM_EMAIL || process.env.BREVO_USER || "noreply@blogpage.com";
};

const sendViaBrevoApi = async (email, otp) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = getFromAddress();

  if (!apiKey) return { success: false, message: "BREVO_API_KEY missing" };

  const payload = {
    sender: { email: fromEmail, name: "BlogPage" },
    to: [{ email }],
    subject: "Your Email Verification OTP",
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px; background: #f9fafb;">
        <h2>Verify your email</h2>
        <p>Your OTP is: <b style="font-size: 24px; color: #6366f1;">${otp}</b></p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    const response = await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: { "api-key": apiKey, "content-type": "application/json" },
      timeout: 10000,
    });
    return { success: true, messageId: response.data?.messageId };
  } catch (error) {
    console.error("Brevo API Error:", error.response?.data || error.message);
    return { success: false, message: error.message };
  }
};

const initializeTransporter = () => {
  const user = process.env.BREVO_USER || process.env.BREVO_SMTP_LOGIN;
  const pass = process.env.BREVO_PASS || process.env.BREVO_SMTP_KEY;

  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: { user, pass },
  });

  return transporter;
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  // 1. Try Brevo API first (Bypasses Render SMTP blocks)
  if (process.env.BREVO_API_KEY) {
    console.log(`Attempting API delivery to ${email}...`);
    const result = await sendViaBrevoApi(email, otp);
    if (result.success) return result;
    console.warn("API delivery failed, checking SMTP fallback...");
  }

  // 2. Fallback to SMTP
  if (!transporter) initializeTransporter();

  if (!transporter) {
    return { success: false, message: "No email credentials (API or SMTP) configured" };
  }

  try {
    console.log(`Attempting SMTP delivery to ${email}...`);
    const result = await transporter.sendMail({
      from: getFromAddress(),
      to: email,
      subject: "Your Email Verification OTP",
      text: `Your OTP is: ${otp}`,
      html: `<b>Your OTP is: ${otp}</b>`,
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("SMTP Delivery Error:", error.message);
    return { success: false, message: error.message, errorCode: error.code };
  }
};

const verifyEmailConfig = async () => {
  if (process.env.BREVO_API_KEY) {
    console.log("Email Service: Brevo API Ready");
    return true;
  }

  if (process.env.BREVO_USER && process.env.BREVO_PASS) {
    console.log("Email Service: Brevo SMTP Configured (May timeout on Render)");
    return true;
  }

  console.warn("Email Service: No credentials found. Emails will fail.");
  return false;
};

const sendWebsiteDetailsEmail = async (email) => {
  // Simplified version for now to ensure it works
  return await sendOTPEmail(email, "Welcome to BlogPage!");
};

module.exports = { generateOTP, sendOTPEmail, verifyEmailConfig, sendWebsiteDetailsEmail };
