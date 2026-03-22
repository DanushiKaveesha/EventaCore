const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Import Routes
const clubRoutes = require("./Routes/clubRoutes");
const membershipRoutes = require("./Routes/membershipRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const eventRegistrationRoutes = require("./Routes/eventRegistrationRoutes");
const bookmarkRoutes = require("./Routes/bookmarkRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Test route
app.get("/", (req, res) => {
  res.send("Eventra Backend is running 🚀");
});

// Use Routes
app.use("/api/clubs", clubRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});