import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { NoDataError, BadRequestError } from '../../../core/ApiError';
import BlogRepo from '../../../database/repository/BlogRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import User from '../../../database/model/User';

const router = express.Router();

router.get(
  '/tag/:tag',
  validator(schema.blogTag, ValidationSource.PARAM),
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const blogs = await BlogRepo.findByTagAndPaginated(
      req.params.tag,
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );

    if (!blogs || blogs.length < 1) throw new NoDataError();

    return new SuccessResponse('success', blogs).send(res);
  }),
);

router.get(
  '/author/id/:id',
  validator(schema.authorId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const blogs = await BlogRepo.findAllPublishedForAuthor({
      _id: new Types.ObjectId(req.params.id),
    } as User);

    if (!blogs || blogs.length < 1) throw new NoDataError();

    return new SuccessResponse('success', blogs).send(res);
  }),
);

router.get(
  '/latest',
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const blogs = await BlogRepo.findLatestBlogs(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );

    if (!blogs || blogs.length < 1) throw new NoDataError();

    return new SuccessResponse('success', blogs).send(res);
  }),
);

router.get(
  '/similar/id/:id',
  validator(schema.blogId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const blog = await BlogRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
    if (!blog || !blog.isPublished) throw new BadRequestError('Blog is not available');

    const blogs = await BlogRepo.searchSimilarBlogs(blog, 6);
    if (!blogs || blogs.length < 1) throw new NoDataError();

    return new SuccessResponse('success', blogs).send(res);
  }),
);

export default router;
