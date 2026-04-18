const express = require('express');
const router = express.Router();
const {
  addReview,
  getEventReviews,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('../Controllers/reviewController');
const { protect, adminOnly } = require('../Middleware/authMiddleware');

router.post('/', protect, addReview);
router.get('/event/:eventId', getEventReviews);
router.get('/', protect, adminOnly, getAllReviews);
router.get('/:id', protect, adminOnly, getReviewById);
router.put('/:id', protect, adminOnly, updateReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
