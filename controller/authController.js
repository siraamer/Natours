import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { promisify } from 'util';
import Jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import Explosion from '../utils/appError.js';
import createSendToken from '../utils/generateToken.js';
import Email from '../utils/email.js';
import crypto from 'crypto';

const filterObj = (obj, ...allowedFields) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newobj[el] = obj[el];
  });
  return newobj;
};
//! DiskStorage Engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/img/users');
//   },
//   filename: function (req, file, cb) {
//     const extension = file.mimetype.split('/')[1];
//     const filename = `user-${uuidv4()}-${Date.now()}.${extension}`;
//     cb(null, filename);
//   },
// });
//! Memory Storage
const multerStorage = multer.memoryStorage();
//! filter file type
const filefilters = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Only image is allowed', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: filefilters });

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const uploadUserPhoto = upload.single('photo');

const signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(user, url).sendWelcome();

  createSendToken(user, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //! 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //! 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new Explosion('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

const logout = (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

const protect = catchAsync(async (req, res, next) => {
  //! 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new Explosion(`You are not logged in, please login to get access!`, 401)
    );
  }
  //! 2) Verification token
  const decoded = await promisify(Jwt.verify)(token, process.env.JWT_SECRET);
  //! 3) check if user still exist
  const existUser = await User.findById(decoded.id);
  if (!existUser) {
    return next(
      new Explosion(`The user belong to this token, is no longer exist!`, 401)
    );
  }
  //! 4) check if user changed his password after token was issued
  if (existUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new Explosion(`User recently changed password, please log in again!`, 401)
    );
  }
  req.user = existUser;
  res.locals.user = existUser;

  next();
});

const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      //! 1) verify token
      const decoded = await promisify(Jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //! 2) check if user still exist
      const existUser = await User.findById(decoded.id);
      if (!existUser) {
        return next();
      }
      //! 3) check if user changed his password after token was issued
      if (existUser.passwordChangedAfter(decoded.iat)) {
        return next();
      }
      // there is a logged in user
      res.locals.user = existUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

const allowedTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    //! 1) Access roles
    //! 2) Access register user (req.user)
    if (!roles.includes(req.user.role)) {
      return next(
        new Explosion(`You are not allowed to access this route!`, 403)
      );
    }
    next();
  });

const forgotPassword = catchAsync(async (req, res, next) => {
  //! Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Explosion(`There is no user with thise mail!`, 404));
  }
  //! generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //! send email
  try {
    const tokenUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetpassword/${resetToken}`;
    await new Email(user, tokenUrl).sendPasswordReset();
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new Explosion(`There was an error, please try again later!`, 500)
    );
  }
  res.status(200).json({
    status: 'success',
    message: `Token send to your email.`,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  //! Get user based on the token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //! If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new Explosion(`Token is invalid or has expired!`, 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passworedConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

const updateMyPassword = catchAsync(async (req, res, next) => {
  //! 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //! 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new Explosion('Your current password is wrong.', 401));
  }

  //! 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!
  //! 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

const updateMyInfo = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterBody.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

const deleteMyAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).send('Deleted success!');
});

export {
  logout,
  getMe,
  signUp,
  login,
  protect,
  allowedTo,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  updateMyInfo,
  deleteMyAccount,
  isLoggedIn,
  uploadUserPhoto,
  resizeUserPhoto,
};
