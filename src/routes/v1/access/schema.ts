import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
	userCredential: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	}),
	refreshToken: Joi.object().keys({
		refreshToken: Joi.string().required().min(1),
	}),
	auth: Joi.object().keys({
		'x-access-token': Joi.string().required().min(1),
		'x-user-id': JoiObjectId,
	}).unknown(true),
	signup: Joi.object().keys({
		name: Joi.string().required().min(3),
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
		profilePicUrl: Joi.string().optional().uri(),
	})
};