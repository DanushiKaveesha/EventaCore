import express from 'express';
const router = express.Router();

import {
  registerUser,
  loginUser,
  getServerSessionInfo,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmailCode,
} from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/session-info', getServerSessionInfo);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-email-verification', sendEmailVerification);
router.post('/verify-email-code', verifyEmailCode);

export default router;