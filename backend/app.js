const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Routes
const eventRoutes = require("./Routes/EventRoute");
const bookingRoutes = require("./Routes/BookingRoute");
const userRoutes = require("./Routes/UserRoute");

const clubRoutes = require("./Routes/clubRoutes");
const membershipRoutes = require("./Routes/membershipRoutes");


const eventRegistrationRoutes = require("./Routes/eventRegistrationRoutes");
const bookmarkRoutes = require("./Routes/bookmarkRoutes");
const authRoutes = require("./Routes/authRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const uploadRoutes = require("./Routes/uploadRoutes");
const reviewRoutes = require('./Routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Eventra Backend is running 🚀");
});

// ✅ All Routes (merged)
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

app.use("/api/clubs", clubRoutes);
app.use("/api/memberships", membershipRoutes);


app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/reviews', reviewRoutes);

// ✅ Cron job
const cron = require("node-cron");
const Event = require("./Models/Event");

cron.schedule("0 * * * *", async () => {
  try {
    const events = await Event.find({ status: { $ne: "completed" } });
    const now = new Date();

    for (const event of events) {
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
