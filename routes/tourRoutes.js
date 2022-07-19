import reviewRouter from './reviewRoutes.js';
import express from 'express';
import {
  createTour,
  getAllTour,
  getTour,
  deleteTour,
  updateTour,
  aliasTopTours,
  Stats,
  getMonthyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} from '../controller/tourController.js';
import { protect, allowedTo } from '../controller/authController.js';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/').get(getAllTour).post(
  protect,
  allowedTo('admin'),

  createTour
);
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);
router.route('/tour-stats').get(Stats);
router
  .route('/monthy-plan/:year')
  .get(protect, allowedTo('admin', 'guide'), getMonthyPlan);

router.route('/top-5-tours').get(aliasTopTours, getAllTour);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    allowedTo('admin'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, allowedTo('admin'), deleteTour);

export default router;
