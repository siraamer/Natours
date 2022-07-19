import express from 'express';
import { getCheckoutSession } from '../controller/bookingController.js';
import { protect, allowedTo } from '../controller/authController.js';
import {
  getAllBooking,
  createBooking,
  deleteBooking,
  updateBooking,
  getBooking,
} from '../controller/bookingController.js';
const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession);
router.use(protect, allowedTo('admin'));
router.route('/').get(getAllBooking).post(createBooking);
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
