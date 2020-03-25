import express from 'express';
import { SuccessResponse } from '../../../utils/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError } from '../../../utils/ApiError';
import { IUser } from '../../../database/model/User';
import { createTokens } from '../../../auth/authUtils';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';

const router = express.Router();

router.post('/mindorks', validator(schema.signup), asyncHandler(
	async (req: RoleRequest, res, next) => {

		const user = await UserRepo.findByEmail(req.body.email);
		if (!user) throw new BadRequestError('User already registered');

		const accessTokenKey = crypto.randomBytes(64).toString('hex');
		const refreshTokenKey = crypto.randomBytes(64).toString('hex');
		const passwordHash = await bcrypt.hash(req.body.password, 10);

		const { user: createdUser, keystore } = await UserRepo.create(<IUser>{
			name: req.body.name,
			email: req.body.email,
			password: passwordHash,
		}, accessTokenKey, refreshTokenKey, req.currentRoleCode);

		const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);
		new SuccessResponse('Signup Successful', {
			user: _.pick(user, ['name', 'email', 'roles']),
			tokens: tokens,
		});
	}));

module.exports = router;