import express from 'express';
import { body } from 'express-validator';
import {
  addReview,
  getEventReviews,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('eventId').notEmpty().withMessage('Event ID is required').isString(),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isString()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Message is too long')
      .escape(),
  ],
  addReview
);

router.get('/event/:eventId', getEventReviews);

router.get('/', protect, authorizeRoles('admin'), getAllReviews);

router.get('/:id', protect, authorizeRoles('admin'), getReviewById);

router.put(
  '/:id',
  protect,
  authorizeRoles('admin'),
  [
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    body('message')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Message is too long')
      .escape(),
  ],
  updateReview
);

router.delete('/:id', protect, authorizeRoles('admin'), deleteReview);

export default router;
