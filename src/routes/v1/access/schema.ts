import Joi from '@hapi/joi';

export const userCredentialSchema = Joi.object().keys({
	'email': Joi.string().required().email(),
	'password': Joi.string().required().min(6),
});