const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getServerSessionInfo,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmailCode,
  googleAuth,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/session-info', getServerSessionInfo);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-email-verification', sendEmailVerification);
router.post('/verify-email-code', verifyEmailCode);
router.post('/google', googleAuth);

module.exports = router;