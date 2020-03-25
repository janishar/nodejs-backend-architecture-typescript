import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
	blogUrl: Joi.object().keys({
		url: Joi.string().required().uri()
	}),
	blogId: Joi.object().keys({
		id: JoiObjectId
	}),
	blogTag: Joi.object().keys({
		tag: Joi.string().required().min(1)
	}),
	pagination: Joi.object().keys({
		pageNumber: Joi.number().required().integer().min(1),
		pageItemCount: Joi.number().required().integer().min(1),
	}),
	authorId: Joi.object().keys({
		id: JoiObjectId
	}),
};