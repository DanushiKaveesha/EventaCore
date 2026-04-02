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
  googleLogin,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/session-info', getServerSessionInfo);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-email-verification', sendEmailVerification);
router.post('/verify-email-code', verifyEmailCode);

export default router;