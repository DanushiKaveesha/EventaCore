const Event = require("../Models/Event");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    let { name, description, location, date, time, status, tickets, promotions } = req.body;
    
    // Handle JSON parsing for multipart/form-data
    if (typeof tickets === "string") tickets = JSON.parse(tickets);
    if (typeof promotions === "string") promotions = JSON.parse(promotions);

    const eventData = {
      name, description, location, date, time,
      status: status || "upcoming",
      tickets: tickets || [],
      promotions: promotions || []
    };

    if (req.file) {
      eventData.imageUrl = `uploads/${req.file.filename}`;
    }

    const event = new Event(eventData);
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

    // Parse JSON arrays for tickets and promotions if they come as strings from FormData
    if (req.body.tickets && typeof req.body.tickets === "string") {
      req.body.tickets = JSON.parse(req.body.tickets);
    }
    if (req.body.promotions && typeof req.body.promotions === "string") {
      req.body.promotions = JSON.parse(req.body.promotions);
    }

    // Update main fields
    ["name", "description", "location", "date", "time", "status"].forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    // Replace tickets array if provided
    if (req.body.tickets) event.tickets = req.body.tickets;

    // Replace promotions array if provided
    if (req.body.promotions) event.promotions = req.body.promotions;

    // Update image if a new one was uploaded
    if (req.file) {
      event.imageUrl = `uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
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