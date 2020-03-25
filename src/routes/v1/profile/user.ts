import express from 'express';
import { SuccessResponse } from '../../../utils/ApiResponse';
import UserRepo from '../../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../../utils/ApiError';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';

const router = express.Router();

router.get('/public/id/:id', validator(schema.userId, ValidationSource.PARAM),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const user = await UserRepo.findPublicProfileById(new Types.ObjectId(req.params.id));
		if (user == null) throw new BadRequestError('User not registered');
		return new SuccessResponse('success', _.pick(user, ['name', 'profilePicUrl']));
	}));

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', require('../../../auth/Authentication'));
/*-------------------------------------------------------------------------*/

router.get('/my',
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const user = await UserRepo.findProfileById(req.user._id);
		if (user == null) throw new BadRequestError('User not registered');
		return new SuccessResponse('success', _.pick(user, ['name', 'profilePicUrl', 'roles']));
	}));

router.put('/', validator(schema.profile),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		const user = await UserRepo.findProfileById(req.user._id);
		if (user == null) throw new BadRequestError('User not registered');

		if (req.body.name) user.name = req.body.name;
		if (req.body.profilePicUrl) user.profilePicUrl = req.body.profilePicUrl;

		await UserRepo.updateInfo(user);
		return new SuccessResponse('Profile updated', _.pick(user, ['name', 'profilePicUrl', 'roles']));
	}));

module.exports = router;