import express from 'express';
import {
  isLoggedIn,
  protect,
  updateMyInfo,
} from '../controller/authController.js';
const router = express.Router();

import { createBookingCheckout } from '../controller/bookingController.js';
import {
  getOverview,
  getTour,
  getLoginForm,
  getMyTours,
  getAccount,
  getSignupForm,
} from '../controller/viewController.js';

router.get('/', createBookingCheckout, isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);
router.post('/submit-user-data', protect, updateMyInfo);
router.get('/signup', getSignupForm);

export default router;
