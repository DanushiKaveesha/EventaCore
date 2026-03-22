const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/BookingController");
const upload = require("../Middleware/upload");

// Create a new booking
router.post("/", bookingController.createBooking);

// Upload payment slip
router.put("/:bookingId/upload-slip", upload.single("paymentSlip"), bookingController.uploadPaymentSlip);

// Get user's bookings
router.get("/user/:userId", bookingController.getMyBookings);

// Get single booking details
router.get("/:bookingId", bookingController.getBookingDetails);

// Update booking status (Admin/Organizer verification)
router.put("/status/:bookingId", bookingController.updateBookingStatus);

// Get all bookings (Admin only)
router.get("/", bookingController.getAllBookings);

module.exports = router;
