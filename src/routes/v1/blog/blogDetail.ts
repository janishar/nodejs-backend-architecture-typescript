import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';
import BlogRepo from '../../../database/repository/BlogRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';

const router = express.Router();

router.get(
  '/url',
  validator(schema.blogUrl, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const blog = await BlogRepo.findByUrl(req.query.endpoint as string);
    if (!blog) throw new BadRequestError('Blog do not exists');
    new SuccessResponse('success', blog).send(res);
  }),
);

router.get(
  '/id/:id',
  validator(schema.blogId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const blog = await BlogRepo.findInfoWithTextById(new Types.ObjectId(req.params.id));
    if (!blog) throw new BadRequestError('Blog do not exists');
    return new SuccessResponse('success', blog).send(res);
  }),
);

export default router;
