const nodemailer = require("nodemailer");
const axios = require("axios");

let transporter;
const isProduction = process.env.NODE_ENV === "production";

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
  if (getEmailProvider() === "brevo" && process.env.BREVO_API_KEY) {
    console.log(`Sending OTP to ${email} via Brevo API...`);
    return sendViaBrevoApi(email, otp);
  }

  if (!transporter) {
    transporter = initializeTransporter();
  }

  if (!transporter) {
    console.error("Email transporter not configured.");
    return {
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

module.exports = { generateOTP, sendOTPEmail, verifyEmailConfig };
