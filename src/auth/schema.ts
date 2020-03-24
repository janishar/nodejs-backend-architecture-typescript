import Joi from 'joi';

export const apikeySchema = Joi.object().keys({
	'x-api-key': Joi.string().required().min(1)
});