import express from 'express';
import { getUser } from '../controller/userController.js';
import {
  signUpValidator,
  loginValidator,
  passwordValidator,
  updateMyInfoValidator,
} from '../utils/validator/authValidator.js';

import { protect } from '../controller/authController.js';
import {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  updateMyInfo,
  deleteMyAccount,
  getMe,
  logout,
  uploadUserPhoto,
  resizeUserPhoto,
} from '../controller/authController.js';
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', loginValidator, login);
router.get('/logout', logout);

router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', passwordValidator, resetPassword);

router.use(protect);
router.patch('/updatepassword', passwordValidator, updateMyPassword);
router.patch(
  '/updatemyinfo',
  updateMyInfoValidator,
  uploadUserPhoto,
  resizeUserPhoto,
  updateMyInfo
);
router.delete('/deleteMyAccount', deleteMyAccount);
router.get('/me', getMe, getUser);
export default router;
