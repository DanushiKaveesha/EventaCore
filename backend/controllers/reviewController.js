const { validationResult } = require('express-validator');
const ReviewRating = require('../models/ReviewRating');

// @desc    Add a new review & rating for an event
// @route   POST /api/reviews
// @access  Public (Can be protected if auth is added)
const addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, userId, userName, rating, message } = req.body;

    const review = new ReviewRating({
      eventId,
      userId,
      userName,
      rating,
      message,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Server error while adding review' });
  }
};

// @desc    Get all reviews for a specific event
// @route   GET /api/reviews/:eventId
// @access  Public
const getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;

    const reviews = await ReviewRating.find({ eventId }).sort({ createdAt: -1 });
    
    // Calculate average rating
    const count = reviews.length;
    const averageRating = count > 0 
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1) 
      : 0;

    res.status(200).json({
      reviews,
      count,
      averageRating: parseFloat(averageRating)
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error while fetching reviews' });
  }
};

module.exports = {
  addReview,
  getEventReviews,
};
