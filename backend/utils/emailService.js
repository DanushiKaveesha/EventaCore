const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const verifyTransporter = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Nodemailer transport is ready to send emails.');
  } catch (error) {
    console.error('Nodemailer transport verification error:', error);
  }
};

verifyTransporter();

// --- Function 1: Welcome Email ---
const sendWelcomeEmail = async (email, username) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EventraCore" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to EventraCore!',
    html: `
      <h1>Hi ${username},</h1>
      <p>Welcome to EventraCore! We're glad to have you on board.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}: ${info.response}`);
  } catch (err) {
    console.error('Welcome email error:', err);
  }
};

// --- Function 2: New User Notification for Manager ---
const sendNewUserNotification = async (newUser) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EventraCore" <${process.env.EMAIL_USER}>`,
    to: process.env.SERVICE_MANAGER_EMAIL || process.env.EMAIL_USER,
    subject: 'New User Registration',
    html: `
      <h2>A new user has registered on EventraCore:</h2>
      <ul>
        <li><strong>Name:</strong> ${newUser.name}</li>
        <li><strong>Email:</strong> ${newUser.email}</li>
        <li><strong>Registered At:</strong> ${new Date(newUser.createdAt).toLocaleString()}</li>
      </ul>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`New user notification sent: ${info.response}`);
  } catch (err) {
    console.error('New user notification email error:', err);
  }
};

// --- Function 3: Password Reset Code Email ---
const sendPasswordResetCodeEmail = async (email, code) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EventraCore" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Password Reset Code',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Use the following code to reset your password:</p>
      <h3><strong>${code}</strong></h3>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset code sent to ${email}: ${info.response}`);
  } catch (err) {
    console.error('Password reset email error:', err);
  }
};

// --- Function 4: Email Verification Code ---
const sendEmailVerificationCode = async (email, code) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EventraCore" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification Code',
    html: `
      <h2>Email Verification</h2>
      <p>Thank you for signing up! Please verify your email address using the following code:</p>
      <h3><strong>${code}</strong></h3>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email verification code sent to ${email}: ${info.response}`);
  } catch (err) {
    console.error('Email verification error:', err);
  }
};

// --- Function 5: Low Stock Alert Email ---
const sendLowStockAlert = async (product) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EventraCore" <${process.env.EMAIL_USER}>`,
    to: process.env.SERVICE_MANAGER_EMAIL || process.env.EMAIL_USER,
    subject: `LOW STOCK ALERT: ${product.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Low Stock Alert</h2>
        <p>Dear Admin,</p>
        <p>The following product is running low on stock:</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #072679; margin-top: 0;">${product.name}</h3>
          <p><strong>Product ID:</strong> ${product.productId}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Brand:</strong> ${product.brand}</p>
          <p><strong>Current Stock:</strong> <span style="color: #dc3545; font-weight: bold;">${product.stock_quantity}</span></p>
          <p><strong>Price:</strong> LKR ${product.price}</p>
        </div>

        <p style="color: #dc3545; font-weight: bold;">Action Required: Please restock this item immediately.</p>

        <hr style="margin: 30px 0;">
        <p style="color: #6c757d; font-size: 12px;">
          This is an automated alert from EventraCore.<br>
          Generated on: ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Low stock alert email sent: ${info.response}`);
  } catch (error) {
    console.error('Failed to send low stock alert email:', error);
  }
};

// --- Function 6: Admin-to-User Custom Email ---
const sendAdminCustomEmail = async (to, subject, message) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EventraCore Admin" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject || 'Official Message from EventraCore Support',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #072679; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Official Communication</h1>
        </div>
        <div style="padding: 40px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 12px 12px; background-color: #ffffff;">
          <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">You have received a priority message from the EventraCore administration regarding your account.</p>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-left: 4px solid #072679; margin: 20px 0; font-style: italic;">
            ${message.replace(/\n/g, '<br>')}
          </div>

          <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
            This is an official platform notification. If you have any questions, please reply to this email or contact support.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          &copy; 2026 EventraCore Platform. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Admin custom email sent to ${to}: ${info.response}`);
    return info;
  } catch (error) {
    console.error('Failed to send admin custom email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNewUserNotification,
  sendPasswordResetCodeEmail,
  sendEmailVerificationCode,
  sendLowStockAlert,
  sendAdminCustomEmail,
};