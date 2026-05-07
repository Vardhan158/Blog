# 📧 Email Setup Guide for OTP Verification

## ❌ Problem: OTP Not Receiving

The email credentials are not configured in your `.env` file. Here's how to fix it:

---

## ✅ Solution: Configure Gmail (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Find "2-Step Verification" and enable it
3. Verify with your phone

### Step 2: Create App Password
1. After 2FA is enabled, go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select:
   - **App**: Mail
   - **Device**: Windows PC (or your device)
3. Google will generate a **16-character password**
4. Copy this password

### Step 3: Update `.env` File
Open `backend/.env` and update these lines:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

Replace:
- `your_email@gmail.com` - Your Gmail address
- `xxxx xxxx xxxx xxxx` - The 16-char App Password (keep spaces)

**Example:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### Step 4: Save & Restart Server
```bash
cd backend
npm start
```

You should see in console:
```
✅ Email configuration verified successfully
```

---

## 🧪 Testing

1. Go to **Signup page**
2. Enter email and credentials
3. Click **"Continue"**
4. Check if you receive the OTP email in **5-10 seconds**

If still not working, check:
- Email in "Spam/Promotions" folder
- Server console for error messages (look for ❌ symbols)

---

## 🔧 Alternative Email Services

### Outlook.com
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

### Yahoo Mail
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

### Mailtrap (for Testing)
```env
EMAIL_SERVICE=mailtrap
EMAIL_USER=your_mailtrap_inbox_id
EMAIL_PASS=your_mailtrap_password
```

---

## ❓ Still Not Working?

Check the backend console logs for messages like:
- `❌ Email transporter not configured` - Missing credentials
- `❌ Error sending OTP email` - Invalid credentials or network issue
- `✅ OTP email sent successfully` - Working!

Make sure to **restart the server** after updating `.env` file.
