import express from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  updateReview,
  setIdsToBody,
} from '../controller/reviewController.js';
import {
  createReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
} from '../utils/validator/reviewValidator.js';
import { protect, allowedTo } from '../controller/authController.js';
const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route('/')
  .get(getAllReviews)
  .post(allowedTo('user'), setIdsToBody, createReviewValidator, createReview);
router
  .route('/:id')
  .get(protect, allowedTo('user', 'guide', 'admin'), getReview)
  .patch(protect, allowedTo('user'), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo('user', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

export default router;
