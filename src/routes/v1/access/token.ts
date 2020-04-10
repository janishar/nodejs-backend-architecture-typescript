import express from 'express';
import { TokenRefreshResponse } from '../../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { Types } from 'mongoose';
import UserRepo from '../../../database/repository/UserRepo';
import { AuthFailureError, } from '../../../core/ApiError';
import JWT, { ValidationParams } from '../../../core/JWT';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import crypto from 'crypto';
import { validateTokenData, createTokens, getAccessToken } from '../../../auth/authUtils';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { tokenInfo } from '../../../config';

const router = express.Router();

router.post('/refresh',
	validator(schema.auth, ValidationSource.HEADER), validator(schema.refreshToken),
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

		const accessTokenPayload = await JWT.decode(req.accessToken);
		if (!accessTokenPayload.sub || !Types.ObjectId.isValid(accessTokenPayload.sub))
			throw new AuthFailureError('Invalid access token');

		const user = await UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub));
		if (!user) throw new AuthFailureError('User not registered');
		req.user = user;

		validateTokenData(accessTokenPayload, req.user._id);

		const refreshTokenPayload = await JWT.validate(req.body.refreshToken,
			new ValidationParams(
				tokenInfo.issuer,
				tokenInfo.audience,
				req.user._id.toHexString()));

		const keystore = await KeystoreRepo.find(
			req.user._id,
			accessTokenPayload.prm,
			refreshTokenPayload.prm
		);

		if (!keystore) throw new AuthFailureError('Invalid access token');
		await KeystoreRepo.remove(keystore._id);

		const accessTokenKey = crypto.randomBytes(64).toString('hex');
		const refreshTokenKey = crypto.randomBytes(64).toString('hex');

		await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey);
		const tokens = await createTokens(req.user, accessTokenKey, refreshTokenKey);

		new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
	}));

export default router;