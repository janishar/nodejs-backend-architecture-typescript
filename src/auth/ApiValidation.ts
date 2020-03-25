import express, { NextFunction, Response } from 'express';
import ApiKeyRepo from '../database/repository/ApiKeyRepo';
import { ForbiddenError } from '../utils/ApiError';
import Logger from '../utils/Logger';
import { PublicRequest } from 'app-request';
import schema from './schema';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();

router.use(validator(schema.apiKey, ValidationSource.HEADER), asyncHandler(
	async (req: PublicRequest, res: Response, next: NextFunction) => {

		req.apiKey = req.headers['x-api-key'].toString();

		const apiKey = await ApiKeyRepo.findByKey(req.apiKey);
		Logger.info(apiKey);

		if (!apiKey) throw new ForbiddenError();
		return next();
	}
));

module.exports = router;
