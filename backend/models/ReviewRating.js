const mongoose = require('mongoose');

const reviewRatingSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: String, // Or ObjectId if using User authentication properly, String is flexible for now
      required: true,
    },
    userName: {
      type: String, // To display the reviewer name
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

module.exports = mongoose.model('ReviewRating', reviewRatingSchema);
