import { check } from 'express-validator';
import validatorMiddleware from './validatorMiddleware.js';
const tourValidator = [
  check('name')
    .notEmpty()
    .withMessage('A tour name must not be empty!')
    .isLength({ min: 8 })
    .withMessage('Too Short Name')
    .isLength({ max: 32 })
    .withMessage('Too Long Name!'),
  check('imageCover')
    .notEmpty()
    .withMessage('A tour must have an image cover!'),
  check('difficulty').notEmpty().withMessage('A tour must have a difficulty'),
  check('maxGroupSize')
    .notEmpty()
    .withMessage('A tour must have a group size!'),
  check('duration').notEmpty().withMessage('A tour must have a difficulty!'),
  check('price').notEmpty().withMessage('A tour must have a price!'),
  validatorMiddleware,
];

export { tourValidator };
