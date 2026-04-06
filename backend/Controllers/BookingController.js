const Booking = require("../Models/Booking");
const Event = require("../Models/Event");
const User = require("../Models/User");
const Club = require("../Models/clubModel");
const EventRegistration = require("../Models/eventRegistrationModel");
const Notification = require("../Models/Notification");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { eventId, userId, userName, userEmail, selectedTickets, promotionCode } = req.body;

    // 1. Resolve User Identity for Snapshot
    let finalUserName = userName;
    let finalUserEmail = userEmail;

    console.log('[createBooking] Received:', { userId, userName, userEmail });

    if (userId && (!finalUserName || !finalUserEmail)) {
      const dbUser = await User.findById(userId);
      if (dbUser) {
        finalUserName = finalUserName || (dbUser.firstName && dbUser.lastName ? `${dbUser.firstName} ${dbUser.lastName}` : (dbUser.username || dbUser.name));
        finalUserEmail = finalUserEmail || dbUser.email;
      }
    }

    console.log('[createBooking] Resolved:', { finalUserName, finalUserEmail });

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
    const isFree = totalAmount === 0;
    const newBooking = new Booking({
      event: eventId,
      user: userId || undefined,
      userName: finalUserName || "Guest User",
      userEmail: finalUserEmail || "",
      tickets: bookedTickets,
      totalAmount,
      promotionCode,
      discountAmount,
      status: isFree ? "confirmed" : "pending",
    });

    if (isFree) {
      // Deduct ticket quantities immediately for free events
      for (const item of selectedTickets) {
        const eventTicket = event.tickets.find((t) => t.type === item.type);
        if (eventTicket) {
          eventTicket.quantity -= item.quantity;
        }
      }
      await event.save();
    }

    const savedBooking = await newBooking.save();

    // Create a notification for the user
    if (userId) {
      await Notification.create({
        user: userId,
        message: `Your booking for "${event.name}" was successful.`,
        actionLink: '/my-bookings',
        actionText: 'View My Bookings',
        type: 'system'
      });
    }

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

// Get user's Unified Bookings (combined Bookings and Registrations)
const getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details for multi-key lookup
    const user = await User.findById(userId);
    const userEmail = user ? user.email : null;
    const userName = user ? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.username || user.name)) : null;

    // 1. Fetch from Booking collection
    // Query by ID OR Email OR Name (to catch orphaned or guest-converted bookings)
    const bookingQuery = {
      $or: [{ user: userId }]
    };
    if (userEmail) bookingQuery.$or.push({ userEmail: userEmail });
    if (userName) bookingQuery.$or.push({ userName: userName });

    const standardBookings = await Booking.find(bookingQuery)
      .populate("event", "name date location imageUrl description")
      .lean();

    // 2. Fetch from EventRegistration collection
    const registrationQuery = {
      $or: [{ user: userId }]
    };
    if (userEmail) registrationQuery.$or.push({ email: userEmail });

    const registrations = await EventRegistration.find(registrationQuery)
      .populate("clubId", "name image events")
      .lean();

    // 3. Normalize and enrich Registrations
    const normalizedRegistrations = registrations.map(reg => {
      // Find embedded event details from club if possible
      let eventDetails = {
        name: reg.eventName || "Event Registration",
        date: reg.createdAt,
        location: "On-site / Campus",
        imageUrl: reg.clubId?.image || "",
      };

      if (reg.clubId && reg.clubId.events) {
        const embeddedEvent = reg.clubId.events.find(e => e._id.toString() === reg.eventId.toString());
        if (embeddedEvent) {
          eventDetails.name = embeddedEvent.name;
          eventDetails.date = embeddedEvent.date;
          if (embeddedEvent.location) eventDetails.location = embeddedEvent.location;
        }
      }

      return {
        _id: reg._id,
        event: eventDetails,
        tickets: [{ type: "Registration", quantity: 1, price: 0 }],
        totalAmount: 0,
        status: reg.status === 'approved' ? 'confirmed' :
          reg.status === 'rejected' ? 'rejected' : 'pending',
        isRsvp: true,
        createdAt: reg.createdAt
      };
    });

    // 4. Combine and Deduplicate (by event ID)
    const combined = [...standardBookings, ...normalizedRegistrations];
    const seenEvents = new Set();
    const unified = combined.filter(item => {
      const eventId = item.event?._id?.toString() || item.event?.name;
      if (seenEvents.has(eventId)) return false;
      seenEvents.add(eventId);
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(unified);
  } catch (err) {
    console.error("getMyBookings error:", err);
    res.status(500).json({ message: "Unable to retrieve your bookings console: " + err.message });
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

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event", "name date location imageUrl")
      .populate("user", "firstName lastName username email name")
      .sort({ createdAt: -1 })
      .lean();

    // Enrich each booking with resolved display info for the admin portal
    const enriched = bookings.map(b => {
      let displayName = b.userName && b.userName !== 'Guest User' ? b.userName : null;
      let displayEmail = b.userEmail || null;

      // Fall back to populated user object if snapshot fields are missing
      if (!displayName && b.user && typeof b.user === 'object') {
        const u = b.user;
        displayName = (u.firstName && u.lastName)
          ? `${u.firstName} ${u.lastName}`
          : (u.username || u.name || null);
        displayEmail = displayEmail || u.email || null;
      }

      return {
        ...b,
        displayName: displayName || 'Unknown User',
        displayEmail: displayEmail || 'No Email',
      };
    });

    res.status(200).json(enriched);
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
