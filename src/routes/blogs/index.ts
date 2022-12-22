import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { BadRequestError } from '../../core/ApiError';
import BlogRepo from '../../database/repository/BlogRepo';
import { Types } from 'mongoose';
import User from '../../database/model/User';
import BlogsCache from '../../cache/repository/BlogsCache';

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
    return new SuccessResponse('success', blogs).send(res);
  }),
);

router.get(
  '/similar/id/:id',
  validator(schema.blogId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const blogId = new Types.ObjectId(req.params.id);
    let blogs = await BlogsCache.fetchSimilarBlogs(blogId);

    if (!blogs) {
      const blog = await BlogRepo.findInfoForPublishedById(
        new Types.ObjectId(req.params.id),
      );
      if (!blog) throw new BadRequestError('Blog is not available');
      blogs = await BlogRepo.searchSimilarBlogs(blog, 6);

      if (blogs && blogs.length > 0)
        await BlogsCache.saveSimilarBlogs(blogId, blogs);
    }

    return new SuccessResponse('success', blogs ? blogs : []).send(res);
  }),
);

export default router;
