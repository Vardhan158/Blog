const nodemailer = require("nodemailer");
const axios = require("axios");
const { Resend } = require("resend");

let transporter;
const isProduction = process.env.NODE_ENV === "production";

const sendViaResend = async (email, otp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // You can change this once you verify a domain
      to: email,
      subject: 'Your Verification OTP',
      html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    });

    if (error) throw error;
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("Resend API Error:", error);
    return { success: false, errorCode: "RESEND_ERROR", message: error.message };
  }
};

const getEmailProvider = () => {
  if (
    process.env.BREVO_USER ||
    process.env.BREVO_PASS ||
    process.env.BREVO_SMTP_LOGIN ||
    process.env.BREVO_SMTP_KEY
  ) {
    return "brevo";
  }

  return (process.env.EMAIL_PROVIDER || process.env.EMAIL_SERVICE || "gmail").trim().toLowerCase();
};

const getEmailCredentials = () => {
  const provider = getEmailProvider();
  const user =
    process.env.BREVO_USER ||
    process.env.BREVO_SMTP_LOGIN ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER;
  const rawPass =
    process.env.BREVO_PASS ||
    process.env.BREVO_SMTP_KEY ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS;
  const pass = rawPass ? rawPass.replace(/\s+/g, "") : "";

  return { provider, user, pass };
};

const buildTransportConfig = () => {
  const { provider, user, pass } = getEmailCredentials();

  if (!user || !pass) {
    console.warn("Email credentials are missing. Configure SMTP login and key first.");
    return null;
  }

  if (provider === "brevo") {
    const port = Number(process.env.SMTP_PORT || 587);

    return {
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    };
  }

  if (provider === "gmail" || provider === "google") {
    return {
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    };
  }

  return {
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  };
};

const getFromAddress = () => {
  return (
    process.env.BREVO_FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.BREVO_USER ||
    process.env.EMAIL_USER ||
    process.env.BREVO_SMTP_LOGIN
  );
};

const sendViaBrevoApi = async (email, otp) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = getFromAddress();

  if (!apiKey || !fromEmail) {
    return {
      success: false,
      message: "Brevo API configuration is incomplete.",
      debug: isProduction ? undefined : "BREVO_API_KEY or sender email is missing.",
    };
  }

  const payload = {
    sender: {
      email: fromEmail,
      name: process.env.EMAIL_FROM_NAME || "Mern Blog",
    },
    to: [{ email }],
    subject: "Your Email Verification OTP",
    htmlContent: `
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
    const response = await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      timeout: 15000,
    });

    return { success: true, messageId: response.data?.messageId };
  } catch (error) {
    const debugParts = [
      error.message,
      error.response?.data?.message,
      typeof error.response?.data === "string" ? error.response.data : undefined,
    ].filter(Boolean);

    return {
      success: false,
      message: "Failed to send email.",
      errorCode: error.code || error.response?.status,
      debug: isProduction ? undefined : debugParts.join(" | "),
    };
  }
};

const initializeTransporter = () => {
  const transportConfig = buildTransportConfig();

  if (!transportConfig) {
    return null;
  }

  const { provider, user } = getEmailCredentials();

  console.log("Initializing email service...");
  console.log(`   Provider: ${provider}`);
  console.log(`   User: ${user}`);

  transporter = nodemailer.createTransport(transportConfig);

  console.log("Email transporter created");
  return transporter;
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  let apiError = null;

  // Try Resend first (Production/Render friendly)
  if (process.env.RESEND_API_KEY) {
    console.log(`Sending OTP to ${email} via Resend API...`);
    const result = await sendViaResend(email, otp);
    if (result.success) return result;
    apiError = result;
  }

  if (getEmailProvider() === "brevo" && process.env.BREVO_API_KEY) {
    console.log(`Sending OTP to ${email} via Brevo API...`);
    const result = await sendViaBrevoApi(email, otp);
    if (result.success) return result;

    apiError = result;
    console.warn(`Brevo API failed (${result.errorCode}). Attempting SMTP fallback...`);
  }

  if (!transporter) {
    transporter = initializeTransporter();
  }

  if (!transporter) {
    console.error("Email transporter not configured.");
    return apiError || {
      success: false,
      message: "Email service not configured.",
      debug: isProduction ? undefined : "SMTP credentials are missing or invalid.",
    };
  }

  const mailOptions = {
    from: getFromAddress(),
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
    console.log(`Sending OTP to ${email}...`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
    console.log(`   Message ID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`Error sending OTP email to ${email}`);
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Error Message: ${error.message}`);
    if (error.response) console.error(`   SMTP Response: ${error.response}`);
    return {
      success: false,
      message: "Failed to send email.",
      errorCode: error.code,
      debug: isProduction
        ? undefined
        : [error.message, error.response].filter(Boolean).join(" | "),
    };
  }
};

const verifyEmailConfig = async () => {
  if (getEmailProvider() === "brevo" && process.env.BREVO_API_KEY) {
    const fromEmail = getFromAddress();

    if (!fromEmail) {
      console.warn("WARNING: Brevo sender email not configured.");
      return false;
    }

    console.log("Brevo API configuration detected");
    console.log(`   Ready to send emails from: ${fromEmail}`);
    return true;
  }

  const transportConfig = buildTransportConfig();

  if (!transportConfig) {
    console.warn("WARNING: Email credentials not configured. OTP emails will NOT be sent.");
    return false;
  }

  try {
    console.log("Verifying email configuration...");
    transporter = initializeTransporter();

    if (!transporter) {
      console.error("Failed to initialize transporter");
      return false;
    }

    await transporter.verify();
    console.log("Email configuration verified successfully");
    console.log(`   Ready to send emails from: ${getFromAddress()}`);
    return true;
  } catch (error) {
    console.error("Email configuration verification failed:");
    console.error(`   Error: ${error.message}`);
    return false;
  }
};

const sendWebsiteDetailsEmail = async (email) => {
  if (!transporter) {
    transporter = initializeTransporter();
  }

  if (!transporter) {
    console.error("Email transporter not configured.");
    return {
      success: false,
      message: "Email service not configured.",
    };
  }

  console.log(`Preparing to send website details to: ${email}`);

  const mailOptions = {
    from: getFromAddress(),
    to: email,
    subject: "Welcome to BlogPage - Website Details",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 0; margin: 0; background-color: #f4f7fa;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #6366f1; padding: 40px 20px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px;">BlogPage</h1>
                    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0; font-size: 16px;">Your gateway to amazing stories</p>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1e1b4b; margin: 0 0 20px; font-size: 24px;">Welcome to our community!</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 20px;">
                      Thank you for subscribing to <strong>BlogPage</strong>. We're excited to have you with us. Our platform is designed for creators and readers alike.
                    </p>

                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                      <h3 style="color: #6366f1; margin: 0 0 15px; font-size: 18px;">What you can do on BlogPage:</h3>
                      <ul style="padding: 0; margin: 0; list-style-type: none; color: #4b5563; line-height: 1.8;">
                        <li style="margin-bottom: 10px;">✅ <strong>Discover:</strong> Explore diverse categories from Tech to Lifestyle.</li>
                        <li style="margin-bottom: 10px;">✅ <strong>Share:</strong> Publish your own blogs and build your audience.</li>
                        <li style="margin-bottom: 10px;">✅ <strong>Engage:</strong> Like and comment on posts that inspire you.</li>
                        <li style="margin-bottom: 10px;">✅ <strong>Connect:</strong> Follow your favorite authors and get notified.</li>
                      </ul>
                    </div>

                    <div style="text-align: center;">
                      <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}"
                         style="background-color: #6366f1; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Visit Website Now
                      </a>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td align="center" style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                      &copy; 2025 BlogPage. All rights reserved.
                    </p>
                    <p style="font-size: 12px; color: #9ca3af; margin: 5px 0 0;">
                      If you didn't subscribe, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}. MessageId: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`Error sending website details to ${email}:`, error);
    return { success: false, message: error.message };
  }
};

module.exports = { generateOTP, sendOTPEmail, verifyEmailConfig, sendWebsiteDetailsEmail };
