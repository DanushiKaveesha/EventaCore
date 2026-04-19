const ReviewRating = require('../Models/ReviewRating');

const getDisplayName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  return fullName || user?.username || user?.name || 'User';
};

const sanitizeMessage = (message = '') => String(message).trim();

exports.addReview = async (req, res) => {
  try {
    const { eventId, rating, message } = req.body;
    const numericRating = Number(rating);
    const cleanMessage = sanitizeMessage(message);

    if (!eventId || typeof eventId !== 'string') {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    if (!cleanMessage) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (cleanMessage.length > 1000) {
      return res.status(400).json({ message: 'Message is too long' });
    }

    const userId = req.user._id.toString();
    const userName = getDisplayName(req.user);

    let review = await ReviewRating.findOne({ eventId, userId });

    if (review) {
      review.rating = numericRating;
      review.message = cleanMessage;
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
      rating: numericRating,
      message: cleanMessage,
    });

    const savedReview = await review.save();
    return res.status(201).json({
      ...savedReview.toObject(),
      wasUpdated: false,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ message: 'Server error while adding review' });
  }
};

exports.getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;
    const reviews = await ReviewRating.find({ eventId }).sort({ createdAt: -1 });

    const count = reviews.length;
    const averageRating = count > 0
      ? Number((reviews.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) / count).toFixed(1))
      : 0;

    return res.status(200).json({
      reviews,
      count,
      averageRating,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewRating.find().sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return res.status(500).json({ message: 'Server error while fetching all reviews' });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ReviewRating.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    return res.status(500).json({ message: 'Server error while fetching review' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, message } = req.body;

    const review = await ReviewRating.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
      }
      review.rating = numericRating;
    }

    if (message !== undefined) {
      const cleanMessage = sanitizeMessage(message);
      if (!cleanMessage) {
        return res.status(400).json({ message: 'Message is required' });
      }
      if (cleanMessage.length > 1000) {
        return res.status(400).json({ message: 'Message is too long' });
      }
      review.message = cleanMessage;
    }

    const updatedReview = await review.save();
    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ message: 'Server error while updating review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ReviewRating.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();
    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ message: 'Server error while deleting review' });
  }
};
