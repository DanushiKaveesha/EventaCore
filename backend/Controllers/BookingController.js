const Booking = require("../Models/Booking");
const Event = require("../Models/Event");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { eventId, userId, userName, userEmail, selectedTickets, promotionCode } = req.body;

    // 1. Validate event existence
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2. Calculate Total Amount
    let totalAmount = 0;
    const bookedTickets = [];

    for (const item of selectedTickets) {
      const eventTicket = event.tickets.find((t) => t.type === item.type);
      if (!eventTicket) {
        return res.status(400).json({ message: `Ticket type ${item.type} not found for this event` });
      }

      if (eventTicket.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient quantity for ${item.type}` });
      }

      const lineTotal = eventTicket.price * item.quantity;
      totalAmount += lineTotal;
      bookedTickets.push({
        type: item.type,
        quantity: item.quantity,
        price: eventTicket.price,
      });
    }

    // 3. Apply Promotion (if provided)
    let discountAmount = 0;
    if (promotionCode) {
      const promo = event.promotions.find((p) => p.code === promotionCode);
      if (promo) {
        discountAmount = (totalAmount * promo.discountPercentage) / 100;
        totalAmount -= discountAmount;
      } else {
        return res.status(400).json({ message: "Invalid promotion code" });
      }
    }

    // 4. Create Booking — store user display info directly for reliable admin display
    const newBooking = new Booking({
      event: eventId,
      user: userId || undefined,
      userName: userName || "Guest User",
      userEmail: userEmail || "",
      tickets: bookedTickets,
      totalAmount,
      promotionCode,
      discountAmount,
      status: "pending",
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload payment slip
const uploadPaymentSlip = async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!req.file) return res.status(400).json({ message: "Please upload a payment slip" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Normalize path to forward slashes for cross-platform URL compatibility
    booking.paymentSlip = req.file.path.replace(/\\/g, "/");
    const updatedBooking = await booking.save();

    res.status(200).json({ message: "Payment slip uploaded successfully", booking: updatedBooking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId }).populate("event", "name date location imageUrl");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single booking details
const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate("event", "name date location imageUrl");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update booking status (Admin/Organizer verification)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // 'confirmed' or 'rejected'

    const booking = await Booking.findById(bookingId).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (status === "confirmed" && booking.status !== "confirmed") {
      // Deduct ticket quantities from event
      const event = await Event.findById(booking.event._id);
      for (const bookedTicket of booking.tickets) {
        const eventTicket = event.tickets.find((t) => t.type === bookedTicket.type);
        if (eventTicket) {
          eventTicket.quantity -= bookedTicket.quantity;
        }
      }
      await event.save();
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings (Admin only) — no user populate to avoid 'Schema not registered' error
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event", "name date location imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking,
  uploadPaymentSlip,
  getMyBookings,
  getBookingDetails,
  updateBookingStatus,
  getAllBookings,
};
