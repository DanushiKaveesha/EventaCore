const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Eventra Backend is running 🚀");
});

// Import Routes
const reviewRoutes = require('./routes/reviewRoutes');

// Use Routes
app.use('/api/reviews', reviewRoutes);

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});