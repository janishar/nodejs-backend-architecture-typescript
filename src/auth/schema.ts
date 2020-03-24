import Joi from '@hapi/joi';

export const apikeySchema = Joi.object().keys({
	'x-api-key': Joi.string().required().min(1)
});

export const authSchema = Joi.object().keys({
	'x-access-token': Joi.string().required().min(1),
	'x-user-id': Joi.string().required().min(1),
});