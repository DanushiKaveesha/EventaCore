const express = require('express');
const router = express.Router();
const { addReview, getEventReviews } = require('../controllers/reviewController');

const { body } = require('express-validator');

// Add a new review with validation
router.post(
  '/',
  [
    body('eventId').notEmpty().withMessage('Event ID is required').isString(),
    body('userId').notEmpty().withMessage('User ID is required').isString(),
    body('userName').notEmpty().withMessage('User Name is required').isString().trim().escape(),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('message').notEmpty().withMessage('Message is required').isString().trim().isLength({ max: 1000 }).withMessage('Message is too long').escape()
  ],
  addReview
);

// Get reviews for a specific event
router.get('/:eventId', getEventReviews);

module.exports = router;
