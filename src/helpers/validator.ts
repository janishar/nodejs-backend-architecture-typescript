import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/Logger';
import { BadRequestError } from '../utils/ApiError';
import { Types } from 'mongoose';

export enum ValidationSource {
	BODY = 'body',
	HEADER = 'headers',
	QUERY = 'query',
	PARAM = 'params'
}

export const JoiObjectId = () => Joi.string().custom((value: string, helpers) => {
	if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
	return value;
}, 'Object Id Validation');

export const JoiUrlEndpoint = () => Joi.string().custom((value: string, helpers) => {
	if (value.includes('://')) return helpers.error('any.invalid');
	return value;
}, 'Url Endpoint Validation');


export default (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const { error } = schema.validate(req[source]);

			if (!error) return next();

			const { details } = error;
			const message = details.map(i => i.message.replace(/['"]+/g, '')).join(',');
			Logger.error(message);

			next(new BadRequestError(message));
		} catch (error) {
			next(error);
		}
	};