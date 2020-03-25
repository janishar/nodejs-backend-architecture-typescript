import express from 'express';
import { SuccessResponse, SuccessMsgResponse } from '../../../utils/ApiResponse'
import { ProtectedRequest, RoleRequest } from 'app-request';
import { BadRequestError, ForbiddenError } from '../../../utils/ApiError';
import BlogRepo from '../../../database/repository/BlogRepo';
import { IBlog } from '../../../database/model/Blog';
import { RoleCode } from '../../../database/model/Role';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for writer's role
router.use('/',
	require('../../../auth/authentication'),
	(req: RoleRequest, res, next) => { req.currentRoleCode = RoleCode.WRITER; next(); },
	require('../../../auth/authorization'));
/*-------------------------------------------------------------------------*/

router.post('/', validator(schema.blogCreate),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		req.body.blogUrl = req.body.blogUrl.replace(/\s/g, '').replace(/\//g, '-');

		const blog = await BlogRepo.findByUrl(req.body.blogUrl);
		if (blog) throw new BadRequestError('Blog with this url already exists');

		const createdBlog = await BlogRepo.create(<IBlog>{
			title: req.body.title,
			description: req.body.description,
			draftText: req.body.text,
			tags: req.body.tags,
			author: req.user,
			blogUrl: req.body.blogUrl,
			imgUrl: req.body.imgUrl,
			score: req.body.score,
			createdBy: req.user,
			updatedBy: req.user
		});

		new SuccessResponse('Blog created successfully', createdBlog).send(res);
	}));

router.put('/id/:id',
	validator(schema.blogId, ValidationSource.PARAM),
	validator(schema.blogCreate),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const blog = await BlogRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
		if (blog == null) throw new BadRequestError('Blog does not exists');
		if (!blog.author._id.equals(req.user._id)) throw new ForbiddenError("You don't have necessary permissions");

		if (req.body.title) blog.title = req.body.title;
		if (req.body.description) blog.description = req.body.description;
		if (req.body.text) blog.draftText = req.body.text;
		if (req.body.tags) blog.tags = req.body.tags;
		if (req.body.blogUrl) blog.blogUrl = req.body.blogUrl.replace(/\s/g, '').replace(/\//g, '-');
		if (req.body.imgUrl) blog.imgUrl = req.body.imgUrl;
		if (req.body.score) blog.score = req.body.score;

		await BlogRepo.update(blog);
		new SuccessResponse('Blog updated successfully', blog).send(res);
	}));

router.put('/submit/:id', validator(schema.blogId, ValidationSource.PARAM),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const blog = await BlogRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
		if (blog == null) throw new BadRequestError('Blog does not exists');
		if (!blog.author._id.equals(req.user._id)) throw new ForbiddenError("You don't have necessary permissions");

		blog.isSubmitted = true;
		blog.isDraft = false;

		await BlogRepo.update(blog);
		return new SuccessMsgResponse('Blog submitted successfully').send(res);
	}));

router.put('/withdraw/:id', validator(schema.blogId, ValidationSource.PARAM),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const blog = await BlogRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
		if (blog == null) throw new BadRequestError('Blog does not exists');
		if (!blog.author._id.equals(req.user._id)) throw new ForbiddenError("You don't have necessary permissions");

		blog.isSubmitted = false;
		blog.isDraft = true;

		await BlogRepo.update(blog);
		return new SuccessMsgResponse('Blog withdrawn successfully').send(res);
	}));

router.delete('/id/:id', validator(schema.blogId, ValidationSource.PARAM),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const blog = await BlogRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
		if (blog == null) throw new BadRequestError('Blog does not exists');
		if (!blog.author._id.equals(req.user._id)) throw new ForbiddenError("You don't have necessary permissions");

		if (blog.isPublished) {
			blog.isDraft = false;
			// revert to the original state
			blog.draftText = blog.text;
		} else {
			blog.status = false;
		}

		await BlogRepo.update(blog);
		return new SuccessMsgResponse('Blog deleted successfully').send(res);
	}));

router.get('/submitted/all',
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const blogs = await BlogRepo.findAllSubmissionsForWriter(req.user);
		return new SuccessResponse('success', blogs).send(res);
	}));

router.get('/published/all',
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const blogs = await BlogRepo.findAllPublishedForWriter(req.user);
		return new SuccessResponse('success', blogs).send(res);
	}));

router.get('/drafts/all',
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const blogs = await BlogRepo.findAllDraftsForWriter(req.user);
		return new SuccessResponse('success', blogs).send(res);
	}));

router.get('/id/:id', validator(schema.blogId, ValidationSource.PARAM),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const blog = await BlogRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
		if (blog == null) throw new BadRequestError('Blog does not exists');
		if (!blog.author._id.equals(req.user._id)) throw new ForbiddenError("You don't have necessary permissions");
		new SuccessResponse('success', blog).send(res);
	}));

module.exports = router;