const Notification = require("../Models/notificationModel");

// Get Notifications for a user
exports.getNotifications = async (req, res) => {
    try {
        const { userId } = req.query; // For now, we get it from query. In real app, req.user.id
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark as Read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Internal helper for other controllers
exports.createNotification = async (userId, message, type, relatedId) => {
    try {
        const notification = new Notification({
            userId,
            message,
            type,
            relatedId
        });
        await notification.save();
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
