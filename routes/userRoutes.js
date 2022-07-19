import express from 'express';
import {
  createUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
} from '../controller/userController.js';
import { allowedTo, protect } from '../controller/authController.js';
const router = express.Router();

router.use(protect, allowedTo('admin'));
router.route('/').get(getAllUser).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
