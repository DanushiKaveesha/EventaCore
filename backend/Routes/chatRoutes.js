const express = require("express");
const router = express.Router();
const chatController = require("../Controllers/chatController");

// POST endpoint to handle chatbot queries
router.post("/", chatController.processChatMessage);

module.exports = router;
