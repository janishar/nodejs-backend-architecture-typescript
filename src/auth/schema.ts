import Joi from '@hapi/joi';
import { JoiObjectId } from '../helpers/validator';

export default {
	apiKey: Joi.object().keys({
		'x-api-key': Joi.string().required()
	}).unknown(true),
	auth: Joi.object().keys({
		'x-access-token': Joi.string().required(),
		'x-user-id': JoiObjectId().required(),
	}).unknown(true)
};