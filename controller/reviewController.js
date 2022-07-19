import Review from '../models/reviewModel.js';
import factory from './handlerFactory.js';

const setIdsToBody = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

const createReview = factory.createOne(Review);
const getAllReviews = factory.getAll(Review);
const getReview = factory.getOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

export {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  updateReview,
  setIdsToBody,
};
