const express = require('express');
const {
  getUserNotifications,
  deleteNotification,
  sendAdminNotification,
} = require('../Controllers/notificationController');
const { protect } = require('../Middleware/authMiddleware');

const router = express.Router();

// Apply 'protect' middleware to all notification routes
router.route('/').get(protect, getUserNotifications);
// Since 'adminOnly' handles authorization, we can use it here
// Make sure to add it to the import above, but wait, let's keep it simple
// and use the existing middleware
const { adminOnly } = require('../Middleware/authMiddleware');
router.route('/send').post(protect, adminOnly, sendAdminNotification);
router.route('/:id').delete(protect, deleteNotification);

module.exports = router;
