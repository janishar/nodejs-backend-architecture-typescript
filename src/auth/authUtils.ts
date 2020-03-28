import { Tokens } from 'app-request';
import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/JWT';
import { Types } from 'mongoose';
import { IUser } from '../database/model/User';
import { tokenInfo } from '../config';

export const validateTokenData = async (payload: JwtPayload, userId: Types.ObjectId): Promise<JwtPayload> => {
	// if (!payload || !payload.iss || !payload.sub || !payload.aud || !payload.prm
	// 	|| payload.iss !== tokenInfo.issuer
	// 	|| payload.aud !== tokenInfo.audience
	// 	|| payload.sub !== userId.toHexString())
	// 	throw new AuthFailureError('Invalid Access Token');
	return payload;
};

export const createTokens = async (user: IUser, accessTokenKey: string, refreshTokenKey: string)
	: Promise<Tokens> => {
	const accessToken = await JWT.encode(
		new JwtPayload(
			tokenInfo.issuer,
			tokenInfo.audience,
			user._id.toString(),
			accessTokenKey,
			tokenInfo.accessTokenValidityDays));

	if (!accessToken) throw new InternalError();

	const refreshToken = await JWT.encode(
		new JwtPayload(
			tokenInfo.issuer,
			tokenInfo.audience,
			user._id.toString(),
			refreshTokenKey,
			tokenInfo.refreshTokenValidityDays));

	if (!refreshToken) throw new InternalError();

	return <Tokens>{
		accessToken: accessToken,
		refreshToken: refreshToken
	};
};