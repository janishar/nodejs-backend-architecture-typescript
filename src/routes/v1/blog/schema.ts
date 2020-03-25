import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
	blogUrl: Joi.object().keys({
		url: Joi.string().required().uri()
	}),
	blogId: Joi.object().keys({
		id: JoiObjectId()
	}),
	blogTag: Joi.object().keys({
		tag: Joi.string().required().min(1)
	}),
	pagination: Joi.object().keys({
		pageNumber: Joi.number().required().integer().min(1),
		pageItemCount: Joi.number().required().integer().min(1),
	}),
	authorId: Joi.object().keys({
		id: JoiObjectId()
	}),
	blogCreate: Joi.object().keys({
		title: Joi.string().required().min(3).max(500),
		description: Joi.string().required().min(3).max(2000),
		text: Joi.string().required().max(50000),
		blogUrl: Joi.string().required().uri().max(200),
		imgUrl: Joi.string().optional().uri().max(200),
		score: Joi.number().optional().min(0).max(1),
		tags: Joi.array().optional().items(Joi.string().uppercase().min(1)),
	}),
	blogUpdate: Joi.object().keys({
		title: Joi.string().optional().min(3).max(500),
		description: Joi.string().optional().min(3).max(2000),
		text: Joi.string().optional().max(50000),
		blogUrl: Joi.string().optional().uri().max(200),
		imgUrl: Joi.string().optional().uri().max(200),
		score: Joi.number().optional().min(0).max(1),
		tags: Joi.array().optional().items(Joi.string().uppercase().min(1))
	})
};