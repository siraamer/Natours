import { check, body } from 'express-validator';
import validatorMiddleware from './validatorMiddleware.js';
import slugify from 'slugify';
import User from '../../models/userModel.js';

const createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name must not be empty!')
    .isLength({ min: 3 })
    .withMessage('Too Short Name')
    .isLength({ max: 32 })
    .withMessage('Too Long Name!')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email must not be empty!')
    .isEmail()
    .withMessage('Wrong E-mail Format!')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error('This E-mail is already exist, please try to login!')
          );
        }
      })
    ),
  check('password')
    .notEmpty()
    .withMessage('Password must not be empty!')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters at least!')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password And passwordConfirmation Not The Same!');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('PasswordConfirm is Required!'),
  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('This is not a valid phone number in Egypt!'),
  check('role').optional(),
  check('profileIme').optional(),
  validatorMiddleware,
];

const updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User Id Format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .optional()
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error('This E-mail is already exist, please try to login!')
          );
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('This is not a valid phone number in Egypt!'),
  check('role').optional(),
  check('profileIme').optional(),
  validatorMiddleware,
];

const deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User Id Format'),
  validatorMiddleware,
];

const changePasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User Id Format'),
  check('currentPassword')
    .notEmpty()
    .withMessage('You Must Enter Your Current Password!'),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('You Must Enter Your Current Password!'),
  check('password')
    .notEmpty()
    .withMessage('You Must Enter Your Current Password!')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`There Is No User With This ID =>${user} `);
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error(`Your Current Password is incorrect!`);
      }
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password And passwordConfirmation Not The Same!');
      }
      return true;
    }),
  validatorMiddleware,
];

const updateMyInfoValidator = [
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .optional()
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error('This E-mail is already exist, please try to login!')
          );
        }
      })
    ),
  validatorMiddleware,
];

const signUpValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name must not be empty!')
    .isLength({ min: 3 })
    .withMessage('Too Short Name')
    .isLength({ max: 32 })
    .withMessage('Too Long Name!')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email must not be empty!')
    .isEmail()
    .withMessage('Wrong E-mail Format!')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error('This E-mail is already exist, please try to login!')
          );
        }
      })
    ),
  check('password')
    .notEmpty()
    .withMessage('Password must not be empty!')
    .isLength({ min: 8 })
    .withMessage('Password must be 8 characters at least!')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password And passwordConfirmation Not The Same!');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('PasswordConfirm is Required!'),
  validatorMiddleware,
];

const loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email must not be empty!')
    .isEmail()
    .withMessage('Wrong E-mail Format!'),
  check('password')
    .notEmpty()
    .withMessage('Password must not be empty!')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters at least!'),
  validatorMiddleware,
];

const passwordValidator = [
  check('password')
    .notEmpty()
    .withMessage('Password must not be empty!')
    .isLength({ min: 8 })
    .withMessage('Password must be 8 characters at least!')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password And password Confirm Not The Same!');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('PasswordConfirm is Required!'),
  validatorMiddleware,
];

export {
  signUpValidator,
  loginValidator,
  passwordValidator,
  updateMyInfoValidator,
};
