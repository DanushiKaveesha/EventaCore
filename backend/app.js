
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const eventRoutes = require("./Routes/EventRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Eventra Backend is running 🚀");
});


// Use Routes
app.use("/api/events", eventRoutes);

// Serve static uploads folder
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Cron job to auto-update event status
const cron = require("node-cron");
const Event = require("./Models/Event");

cron.schedule("0 * * * *", async () => {
  try {
    const events = await Event.find({ status: { $ne: "completed" } });
    const now = new Date();
    
    for (const event of events) {
      // Basic check: if event date is strictly before today's date, mark completed.
      // E.g., comparing midnight UTC date. For a more robust app, time parsing is needed.
      const eventDate = new Date(event.date);
      if (now.getTime() > eventDate.getTime() + 24 * 60 * 60 * 1000) {
        event.status = "completed";
        await event.save();
      } else if (now.toDateString() === eventDate.toDateString()) {
         event.status = "ongoing";
         await event.save();
      }
    }
  } catch (err) {
    console.error("Cron error updating statuses:", err);
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
