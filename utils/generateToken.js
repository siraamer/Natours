import jwt from 'jsonwebtoken';
import sanitizeUser from './sanitizwData.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: sanitizeUser(user),
    token,
  });
};

export default createSendToken;
