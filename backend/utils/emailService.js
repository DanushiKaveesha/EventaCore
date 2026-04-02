import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

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
    console.log('Transport authenticated as:', process.env.EMAIL_USER);
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

  const info = await transporter.sendMail(mailOptions);
  console.log(`Welcome email sent to ${email}: ${info.response}`);
};

// --- Function 2: New User Notification for Manager ---
const sendNewUserNotification = async (newUser) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EventraCore" <${process.env.EMAIL_USER}>`,
    to: process.env.SERVICE_MANAGER_EMAIL,
    subject: 'New User Registration',
    html: `
      <h2>A new user has registered on EventraCore:</h2>
      <ul>
        <li><strong>Username:</strong> ${newUser.username}</li>
        <li><strong>Email:</strong> ${newUser.email}</li>
        <li><strong>First Name:</strong> ${newUser.firstName}</li>
        <li><strong>Last Name:</strong> ${newUser.lastName}</li>
        <li><strong>Registered At:</strong> ${new Date(newUser.createdAt).toLocaleString()}</li>
      </ul>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`New user notification sent to service manager: ${info.response}`);
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

  const info = await transporter.sendMail(mailOptions);
  console.log(`Password reset code sent to ${email}: ${info.response}`);
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

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email verification code sent to ${email}: ${info.response}`);
};

// --- Function 5: Low Stock Alert Email ---
const sendLowStockAlert = async (product) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EventraCore" <${process.env.EMAIL_USER}>`,
    to: process.env.SERVICE_MANAGER_EMAIL,
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

export {
  sendWelcomeEmail,
  sendNewUserNotification,
  sendPasswordResetCodeEmail,
  sendEmailVerificationCode,
  sendLowStockAlert,
};