import express from 'express';
import {
  getUserNotifications,
  deleteNotification,
  sendAdminNotification,
} from '../controllers/notificationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply 'protect' middleware to all notification routes
router.route('/').get(protect, getUserNotifications);
router.route('/send').post(protect, authorizeRoles('admin'), sendAdminNotification);
router.route('/:id').delete(protect, deleteNotification);

export default router;
