import User from '../models/User.js';
import Notification from '../models/Notification.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import {
  sendWelcomeEmail,
  sendNewUserNotification,
  sendPasswordResetCodeEmail,
  sendEmailVerificationCode,
} from '../utils/emailService.js';

const serverSessionId = Date.now().toString();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Handle new user registration and trigger welcome emails
const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    contactNumber,
    address,
    profileImageURL,
    email,
    username,
    password,
  } = req.body;

  if (!firstName || !lastName || !email || !username || !password) {
    return res
      .status(400)
      .json({ message: 'Please fill out all required fields.' });
  }

  try {
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'User with this email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      dob,
      contactNumber,
      address,
      profileImageURL: profileImageURL || '',
      email,
      username,
      passwordHash,
    });

    const newUser = await user.save();

    if (newUser) {
      Promise.all([
        sendWelcomeEmail(newUser.email, newUser.username),
        sendNewUserNotification(newUser),
        Notification.create({
          user: newUser._id,
          message: `Welcome, ${newUser.firstName}! We're glad you're here. Let's get started.`,
        }),
      ]).catch((err) => {
        console.error('Failed to send registration emails or notifications:', err);
      });

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        profileImageURL: newUser.profileImageURL,
        serverSessionId,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Authenticate user credentials and return a JWT token for session management
const loginUser = async (req, res) => {
  const { loginIdentifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      if (user.status === 'suspended') {
        return res
          .status(403)
          .json({ message: 'Your account has been suspended.' });
      }

      if (user.status === 'deactivated') {
        return res
          .status(403)
          .json({ message: 'Your account has been deactivated.' });
      }

      Notification.create({
        user: user._id,
        message: `Welcome back, ${user.firstName}! We're glad to see you again.`,
      }).catch((err) => {
        console.error('Failed to create welcome back notification:', err);
      });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageURL: user.profileImageURL,
        serverSessionId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getServerSessionInfo = async (req, res) => {
  res.json({ serverSessionId });
};

// Generate and send a 6-digit password reset code to the user's email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = Date.now() + 10 * 60 * 1000;

    user.passwordResetCode = resetCode;
    user.passwordResetExpires = resetCodeExpires;
    await user.save();

    await sendPasswordResetCodeEmail(user.email, resetCode);
    res.json({ message: 'Password reset code sent to your email.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error while sending email.' });
  }
};

// Verify the reset code and securely hash the new password
const resetPassword = async (req, res) => {
  const { email, code, password } = req.body;

  try {
    const user = await User.findOne({
      email,
      passwordResetCode: code,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    Notification.create({
      user: user._id,
      message: 'Your password has been successfully reset. If this was not you, please contact support immediately.',
    }).catch((err) => {
      console.error('Failed to create password reset notification:', err);
    });

    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const sendEmailVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpires = Date.now() + 10 * 60 * 1000;

    const tempVerification = {
      email,
      code: verificationCode,
      expires: codeExpires,
    };

    await sendEmailVerificationCode(email, verificationCode);

    res.json({
      message: 'Verification code sent to your email.',
      tempData: tempVerification,
    });
  } catch (error) {
    console.error('Send Email Verification Error:', error);
    res.status(500).json({
      message: 'Server error while sending verification code.',
      error: error.message,
    });
  }
};

const verifyEmailCode = async (req, res) => {
  const { email, code, tempData } = req.body;

  if (!email || !code) {
    return res
      .status(400)
      .json({ message: 'Email and verification code are required' });
  }

  try {
    if (tempData.email !== email || tempData.code !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (Date.now() > tempData.expires) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify Email Code Error:', error);
    res.status(500).json({ message: 'Server error while verifying code.' });
  }
};

const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Missing Google credential.' });
  }

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, given_name, family_name, picture, sub } = payload;

    let user = await User.findOne({ email });

    // If user already exists, just log them in
    if (user) {
      if (user.status === 'suspended') {
        return res.status(403).json({ message: 'Your account has been suspended.' });
      }
      if (user.status === 'deactivated') {
        return res.status(403).json({ message: 'Your account has been deactivated.' });
      }
      
      // Update googleId and authProvider if they exist but don't have it set
      if (!user.googleId) {
        user.googleId = sub;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create new user based on Google profile
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      user = new User({
        email,
        username,
        firstName: given_name,
        lastName: family_name,
        profileImageURL: picture,
        authProvider: 'google',
        googleId: sub,
        role: 'customer',
        status: 'active',
      });
      await user.save();
      
      Notification.create({
        user: user._id,
        message: `Welcome, ${user.firstName}! We're glad you're here via Google.`,
      }).catch((err) => console.error(err));
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      contactNumber: user.contactNumber,
      address: user.address,
      profileImageURL: user.profileImageURL,
      authProvider: user.authProvider,
      serverSessionId,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Error verifying Google account.' });
  }
};

export {
  registerUser,
  loginUser,
  getServerSessionInfo,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmailCode,
  googleLogin,
};