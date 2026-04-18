const User = require('../Models/User');
const Notification = require('../Models/Notification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  sendWelcomeEmail,
  sendNewUserNotification,
  sendPasswordResetCodeEmail,
  sendEmailVerificationCode,
} = require('../utils/emailService');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const serverSessionId = Date.now().toString();

const generateToken = (id) => {
  if (!id) {
    console.error('generateToken Error: ID is required');
    return null;
  }
  
  const secret = process.env.JWT_SECRET || 'fallback_secret_key'; // Safety fallback
  
  try {
    return jwt.sign({ id: id.toString() }, secret, {
      expiresIn: '30d',
    });
  } catch (err) {
    console.error('JWT Sign Error:', err);
    throw err;
  }
};

// Handle new user registration and trigger welcome emails
const registerUser = async (req, res) => {
  const { 
    firstName, 
    lastName, 
    username, 
    email, 
    password, 
    dob, 
    contactNumber, 
    address, 
    profileImageURL 
  } = req.body;

  // Validation: email and password are always required.
  // We also want name (or firstName) and username.
  if (!email || !password || (!firstName && !req.body.name) || !username) {
    return res.status(400).json({ message: 'Please fill out all required fields (Email, Password, Name, and Username).' });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const name = req.body.name || (firstName && lastName ? `${firstName} ${lastName}` : username);

    const user = new User({
      firstName,
      lastName,
      username,
      name,
      email,
      password,
      dob,
      contactNumber,
      address,
      profileImageURL,
      role: 'Student' // Default to student
    });

    const newUser = await user.save();

    if (newUser) {
      Promise.all([
        sendWelcomeEmail(newUser.email, newUser.normalizedName),
        sendNewUserNotification(newUser),
        Notification.create({
          user: newUser._id,
          message: `Welcome, ${newUser.normalizedName}! We're glad you're here. Let's get started.`,
        }),
      ]).catch((err) => {
        console.error('Failed to send registration emails or notifications:', err);
      });

      const token = generateToken(newUser._id);
      
      if (!token) {
        return res.status(500).json({ message: 'User created but failed to generate session token. Please try logging in.' });
      }

      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        name: newUser.normalizedName,
        email: newUser.email,
        role: newUser.role,
        profileImageURL: newUser.profileImageURL,
        isActive: newUser.isActive,
        serverSessionId,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// Authenticate user credentials and return a JWT token for session management
const loginUser = async (req, res) => {
  const { loginIdentifier, password } = req.body;
  
  if (!loginIdentifier || !password) {
    return res.status(400).json({ message: 'Login identifier and password are required' });
  }

  try {
    // 1. Unified Lookup: Search by Username OR Email OR Full Name (case-insensitive)
    const user = await User.findOne({ 
      $or: [
        { username: { $regex: new RegExp(`^${loginIdentifier}$`, 'i') } }, 
        { email: loginIdentifier.toLowerCase() },
        { name: { $regex: new RegExp(`^${loginIdentifier}$`, 'i') } }
      ] 
    });

    if (user && (await user.comparePassword(password))) {
      // 2. Account Status Check
      const isCurrentlyActive = user.status ? user.status === 'active' : user.isActive !== false;
      if (!isCurrentlyActive) {
        return res.status(403).json({ 
          message: `This account is currently ${user.status || 'deactivated'}. Please contact support.` 
        });
      }

      // 3. Optional: Personal welcome notification
      Notification.create({
        user: user._id,
        message: `Welcome back, ${user.normalizedName}! We're glad to see you again.`,
      }).catch((err) => {
        console.error('Failed to create welcome notification:', err);
      });

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        name: user.normalizedName,
        email: user.email,
        role: user.role,
        profileImageURL: user.profileImageURL,
        isActive: user.isActive,
        serverSessionId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
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
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpire = resetCodeExpires;
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
      email: email.toLowerCase(),
      resetPasswordToken: code,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    // Assign the new password, User pre-save hook handles hashing
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
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
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
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
    return res.status(400).json({ message: 'Email and verification code are required' });
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

const googleAuth = async (req, res) => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ message: 'Google credential missing' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, given_name, family_name, name, picture } = payload;
    
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Auto-register new user
      const randomPassword = Math.random().toString(36).slice(-8) + 'X1!'; 
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      
      user = new User({
        firstName: given_name || name,
        lastName: family_name || '',
        name: name,
        email: email.toLowerCase(),
        username: username,
        password: randomPassword,
        profileImageURL: picture,
        role: 'Student'
      });
      await user.save();
      
      // Send welcome notifications asynchronously
      Promise.all([
        sendWelcomeEmail(user.email, user.normalizedName),
        sendNewUserNotification(user),
        Notification.create({
          user: user._id,
          message: `Welcome, ${user.normalizedName}! We're glad you're here. Let's get started.`,
        }),
      ]).catch((err) => console.error('Failed to send registration emails:', err));
    } else {
      // Check status for existing user
      const isCurrentlyActive = user.status ? user.status === 'active' : user.isActive !== false;
      if (!isCurrentlyActive) {
        return res.status(403).json({ 
          message: `This account is currently ${user.status || 'deactivated'}. Please contact support.` 
        });
      }
    }
    
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      name: user.normalizedName,
      email: user.email,
      role: user.role,
      profileImageURL: user.profileImageURL,
      isActive: user.isActive,
      serverSessionId,
      token: generateToken(user._id),
    });
    
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google credential' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getServerSessionInfo,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmailCode,
  googleAuth,
};