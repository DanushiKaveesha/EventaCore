const express = require("express");
const router = express.Router();
const notificationController = require("../Controllers/notificationController");

router.get("/", notificationController.getNotifications);
router.put("/:id/read", notificationController.markAsRead);

module.exports = router;
