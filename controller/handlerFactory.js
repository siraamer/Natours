import catchAsync from '../utils/catchAsync.js';
import Explosion from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

import pkg from 'mongoose';
const { Model } = pkg;

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new Explosion(`We've No Document With ID. 💥`, 404));
    }
    res.status(200).json({
      Status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)

      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    res.status(200).json({
      Status: 'success',
      Result: docs.length,
      data: docs,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      return next(new Explosion(`We've No Document With ID. 💥`, 404));
    }
    res.status(200).json({
      Status: 'success',
      data: doc,
    });
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new Explosion(`We've No Document With ID. 💥`, 404));
    }
    res.status(204).json({
      Status: 'success',
      data: null,
    });
  });

const factory = { deleteOne, updateOne, createOne, getOne, getAll };

export default factory;
