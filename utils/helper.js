import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many request form this IP, please try again after an hour!`,
});

const whitelist = [
  'duration',
  'price',
  'difficulty',
  'ratingsAverage',
  'ratingsQuantity',
];

export { whitelist, limiter };
