import express from 'express';
import { SuccessResponse } from '../../../utils/ApiResponse'
import { NoDataError } from '../../../utils/ApiError';
import BlogRepo from '../../../database/repository/BlogRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { IUser } from '../../../database/model/User';

const router = express.Router();

router.get('/tag/:tag',
	validator(schema.blogTag, ValidationSource.PARAM),
	validator(schema.pagination, ValidationSource.QUERY),
	asyncHandler(async (req, res, next) => {
		const blogs = await BlogRepo.findByTagAndPaginated(
			req.params.tag,
			parseInt(req.params.pageNumber),
			parseInt(req.params.pageItemCount)
		);

		if (!blogs || blogs.length < 1) throw new NoDataError();

		return new SuccessResponse('success', blogs).send(res);
	}));

router.get('/author/id/:id', validator(schema.authorId, ValidationSource.PARAM),
	asyncHandler(async (req, res, next) => {
		const blogs = await BlogRepo.findAllPublishedForAuthor(<IUser>{
			_id: new Types.ObjectId(req.params.id)
		});

		if (!blogs || blogs.length < 1) throw new NoDataError();

		return new SuccessResponse('success', blogs).send(res);
	}));

router.get('/latest', validator(schema.pagination, ValidationSource.QUERY),
	asyncHandler(async (req, res, next) => {
		const blogs = await BlogRepo.findLatestBlogs(
			parseInt(req.params.pageNumber),
			parseInt(req.params.pageItemCount)
		);

		if (!blogs || blogs.length < 1) throw new NoDataError();

		return new SuccessResponse('success', blogs).send(res);
	}));

router.get('/similar/id/:id', validator(schema.blogId, ValidationSource.PARAM),
	asyncHandler(async (req, res, next) => {
		const blog = await BlogRepo.findInfoById(new Types.ObjectId(req.params.id));
		if (!blog || blog.isPublished === false) throw new NoDataError();

		const blogs = await BlogRepo.searchSimilarBlogs(blog, 6);
		if (!blogs || blogs.length < 1) throw new NoDataError();

		return new SuccessResponse('success', blogs).send(res);
	}));

module.exports = router;