import userRoutes from './userRoutes.js';
import tourRoutes from './tourRoutes.js';
import authRoutes from './authRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import viewRoutes from './viewRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const mountRoutes = (app) => {
  app.use('/', viewRoutes);
  app.use('/api/v1/tours', tourRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/reviews', reviewRoutes);
  app.use('/api/v1/bookings', bookingRoutes);
};

export default mountRoutes;
