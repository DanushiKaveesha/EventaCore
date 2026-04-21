const mongoose = require("mongoose");

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["VIP", "Regular", "Early Bird", "Free Pass"],
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  quantity: {
    type: Number,
    required: false,
  },
});

// Promotion Schema
const promotionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: false,
  },
  discountPercentage: {
    type: Number,
    required: false,
  },
});

// Event Schema
const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    tickets: [ticketSchema],
    promotions: [promotionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);