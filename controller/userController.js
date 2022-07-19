import User from '../models/userModel.js';
import factory from './handlerFactory.js';

const createUser = factory.createOne(User);
const getAllUser = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

export { createUser, deleteUser, getAllUser, getUser, updateUser };
