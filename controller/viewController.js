import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';
import Explosion from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new Explosion('There is no tour with this name!', 404));
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

const getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'log into your account',
  });
};

const getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Create new account!',
  });
};
const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

const getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

const updateUserData = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user,
  });
  next();
});

export {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
  getMyTours,
  getSignupForm,
};
