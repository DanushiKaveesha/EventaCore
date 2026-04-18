const mongoose = require('mongoose');

const reviewRatingSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewRatingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ReviewRating', reviewRatingSchema);
