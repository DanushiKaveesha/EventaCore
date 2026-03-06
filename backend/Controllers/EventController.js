const Event = require("../Models/Event");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Event By ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Find the event first
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Update main fields
    ["name", "location", "date", "status"].forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    // Replace tickets array if provided
    if (req.body.tickets) event.tickets = req.body.tickets;

    // Replace promotions array if provided
    if (req.body.promotions) event.promotions = req.body.promotions;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Apply Promotion
exports.applyPromotion = async (req, res) => {
  try {
    const { code } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const promo = event.promotions.find(
      (p) => p.code.toLowerCase() === code.toLowerCase()
    );

    if (!promo) return res.status(404).json({ message: "Invalid promo code" });

    res.json({
      message: "Promotion applied",
      discount: promo.discountPercentage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};