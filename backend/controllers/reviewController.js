import { validationResult } from 'express-validator';
import ReviewRating from '../models/ReviewRating.js';

const getDisplayName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  return fullName || user?.username || 'User';
};

export const addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, rating, message } = req.body;
    const userId = req.user._id.toString();
    const userName = getDisplayName(req.user);

    let review = await ReviewRating.findOne({ eventId, userId });

    if (review) {
      review.rating = rating;
      review.message = message;
      review.userName = userName;

      const updatedReview = await review.save();
      return res.status(200).json({
        ...updatedReview.toObject(),
        wasUpdated: true,
      });
    }

    review = new ReviewRating({
      eventId,
      userId,
      userName,
      rating,
      message,
    });

    const savedReview = await review.save();
    res.status(201).json({
      ...savedReview.toObject(),
      wasUpdated: false,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Server error while adding review' });
  }
};

export const getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;
    const reviews = await ReviewRating.find({ eventId }).sort({ createdAt: -1 });

    const count = reviews.length;
    const averageRating =
      count > 0
        ? (
            reviews.reduce((acc, curr) => acc + curr.rating, 0) / count
          ).toFixed(1)
        : 0;

    res.status(200).json({
      reviews,
      count,
      averageRating: parseFloat(averageRating),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error while fetching reviews' });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewRating.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ error: 'Server error while fetching all reviews' });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await ReviewRating.findById(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    res.status(500).json({ error: 'Server error while fetching review' });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, message } = req.body;

    const review = await ReviewRating.findById(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (rating !== undefined) {
      review.rating = rating;
    }

    if (message !== undefined) {
      review.message = message;
    }

    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Server error while updating review' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await ReviewRating.findById(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.deleteOne();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Server error while deleting review' });
  }
};
