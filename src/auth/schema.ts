import Joi from '@hapi/joi';
import { JoiObjectId } from '../helpers/validator';

export default {
	apiKey: Joi.object().keys({
		'x-api-key': Joi.string().required().min(1)
	}),
	auth: Joi.object().keys({
		'x-access-token': Joi.string().required().min(1),
		'x-user-id': JoiObjectId,
	})
};