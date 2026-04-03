import Notification from '../models/Notification.js';

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Newest first

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error while fetching notifications.' });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if the notification belongs to the logged-in user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this notification' });
    }

    await notification.deleteOne();

    res.json({ message: 'Notification removed' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error while deleting notification.' });
  }
};

// @desc    Send a notification to a specific user (Admin only)
// @route   POST /api/notifications/send
// @access  Private/Admin
const sendAdminNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: 'User ID and message are required' });
    }

    const notification = await Notification.create({
      user: userId,
      message,
      type: 'admin',
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error sending admin notification:', error);
    res.status(500).json({ message: 'Server error while sending notification.' });
  }
};

export { getUserNotifications, deleteNotification, sendAdminNotification };
