const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/EventController");
const upload = require("../Middleware/upload");

// Create Event
router.post("/create", upload.single("image"), eventController.createEvent);

// Get All Events
router.get("/", eventController.getEvents);

// Get Single Event
router.get("/:id", eventController.getEventById);

// Update Event
router.put("/:id", upload.single("image"), eventController.updateEvent);

// Delete Event
router.delete("/:id", eventController.deleteEvent);

// Apply Promotion
router.post("/:id/promotion", eventController.applyPromotion);

module.exports = router;