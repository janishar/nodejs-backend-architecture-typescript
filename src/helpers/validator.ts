import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/Logger';
import { BadRequestError } from '../utils/ApiError';

export enum ValidationSource {
	BODY = 'body',
	HEADER = 'headers',
	QUERY = 'query',
	PARAM = 'params'
}

export default (schema: Joi.Schema, source: ValidationSource = ValidationSource.BODY) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const { error } = Joi.validate(req[source], schema);

			if (error === null) return next();

			const { details } = error;
			const message = details.map(i => i.message.replace(/['"]+/g, '')).join(',');
			Logger.error(message);

			next(new BadRequestError(message));
		} catch (error) {
			next(error);
		}
	};