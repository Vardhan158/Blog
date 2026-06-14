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

const getEmailTemplate = (otp) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 0; width: 100%; margin: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <tr>
        <td style="background-color: #6366f1; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">BlogPage</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px 30px; color: #333333; line-height: 1.6;">
          <h2 style="margin-top: 0; color: #1e293b; font-size: 22px;">Confirm your email address</h2>
          <p style="font-size: 16px; margin-bottom: 25px;">Welcome to the community! To complete your registration and secure your account, please use the verification code below:</p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 25px; text-align: center; margin: 30px 0;">
            <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Verification Code</span>
            <b style="font-size: 42px; color: #6366f1; letter-spacing: 8px; font-family: monospace;">${otp}</b>
          </div>

          <p style="font-size: 14px; color: #64748b;">This code will expire in <b>10 minutes</b>. If you didn't request this code, you can safely ignore this email.</p>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">

          <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0;">For your security, never share this code with anyone. Our team will never ask for your password or verification codes over email or phone.</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">&copy; 2025 BlogPage. All rights reserved.</p>
          <p style="margin: 5px 0 0;">Inspiring stories for creators everywhere.</p>
        </td>
      </tr>
    </table>
  </div>
`;

const sendViaBrevoApi = async (email, otp) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = getFromAddress();

  if (!apiKey) return { success: false, message: "BREVO_API_KEY is missing from environment variables." };
  if (!fromEmail || fromEmail === "noreply@blogpage.com") {
    return { success: false, message: "BREVO_FROM_EMAIL is missing. Brevo requires a verified sender email." };
  }

  const payload = {
    sender: { email: fromEmail, name: process.env.EMAIL_FROM_NAME || "BlogPage" },
    to: [{ email }],
    subject: "Confirm your email address - BlogPage",
    htmlContent: getEmailTemplate(otp),
  };

  try {
    console.log(`Calling Brevo API for ${email} using sender ${fromEmail}...`);
    const response = await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: { "api-key": apiKey, "content-type": "application/json" },
      timeout: 10000,
    });
    console.log("Brevo API Success:", response.data?.messageId);
    return { success: true, messageId: response.data?.messageId };
  } catch (error) {
    const errorData = error.response?.data;
    console.error("Brevo API Error Details:", JSON.stringify(errorData || error.message));

    let errorMessage = error.message;
    if (errorData?.code === "unauthorized") errorMessage = "Invalid BREVO_API_KEY. Please check your Brevo dashboard.";
    if (errorData?.message?.includes("sender")) errorMessage = `Sender email (${fromEmail}) is not verified in Brevo.`;

    return { success: false, message: errorMessage };
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
  // 1. Try Brevo API first (Required for Render)
  if (process.env.BREVO_API_KEY) {
    console.log(`Attempting API delivery to ${email}...`);
    const result = await sendViaBrevoApi(email, otp);

    // If API works, return success.
    // If it fails with a real error (like 401/400), return that error immediately.
    // We only fall back to SMTP if the API key is missing.
    if (result.success || result.message?.includes("verified") || result.message?.includes("key")) {
      return result;
    }

    console.warn("API delivery failed with network error, checking SMTP fallback (local only)...");
  }

  // 2. Fallback to SMTP (Only works on Localhost, blocked on Render)
  if (isProduction) {
    return { success: false, message: "Email API failed and SMTP is disabled in production to prevent timeouts." };
  }

  if (!transporter) initializeTransporter();

  if (!transporter) {
    return { success: false, message: "No email credentials (API or SMTP) configured" };
  }

    try {
      console.log(`Attempting SMTP delivery to ${email}...`);
      const result = await transporter.sendMail({
        from: getFromAddress(),
        to: email,
        subject: "Confirm your email address - BlogPage",
        text: `Your BlogPage verification code is: ${otp}. This code expires in 10 minutes.`,
        html: getEmailTemplate(otp),
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
