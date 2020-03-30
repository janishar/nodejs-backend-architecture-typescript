import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './mock';
import { validateTokenData, createTokens } from '../../../src/auth/authUtils';
import { JwtPayload } from '../../../src/core/JWT';
import { tokenInfo } from '../../../src/config';
import { Types } from 'mongoose';
import { AuthFailureError } from '../../../src/core/ApiError';
import { IUser } from '../../../src/database/model/User';

describe('authUtils validateTokenData tests', () => {

	beforeAll(() => {
		jest.resetAllMocks();
	});

	it('Should throw error when user is different', async () => {

		const userId = new Types.ObjectId(); // Random Key

		const payload = new JwtPayload(
			tokenInfo.issuer,
			tokenInfo.audience,
			new Types.ObjectId().toHexString(), // Random Key
			ACCESS_TOKEN_KEY,
			tokenInfo.accessTokenValidityDays
		);

		try {
			await validateTokenData(payload, userId);
		} catch (e) {
			expect(e).toBeInstanceOf(AuthFailureError);
		}
	});

	it('Should throw error when access token key is different', async () => {

		const userId = new Types.ObjectId(); // Random Key

		const payload = new JwtPayload(
			tokenInfo.issuer,
			tokenInfo.audience,
			userId.toHexString(),
			'123',
			tokenInfo.accessTokenValidityDays
		);

		try {
			await validateTokenData(payload, userId);
		} catch (e) {
			expect(e).toBeInstanceOf(AuthFailureError);
		}
	});

	it('Should return same payload if all data is correct', async () => {

		const userId = new Types.ObjectId('553f8a4286f5c759f36f8e5b'); // Random Key

		const payload = new JwtPayload(
			tokenInfo.issuer,
			tokenInfo.audience,
			userId.toHexString(),
			ACCESS_TOKEN_KEY,
			tokenInfo.accessTokenValidityDays
		);

		const validatedPayload = await validateTokenData(payload, userId);

		expect(validatedPayload).toMatchObject(payload);
	});
});


describe('authUtils createTokens function', () => {

	beforeAll(() => {
		jest.resetAllMocks();
	});

	it('Should process and return accessToken and refreshToken', async () => {

		const userId = new Types.ObjectId('553f8a4286f5c759f36f8e5b'); // Random Key

		const tokens = await createTokens(<IUser>{ _id: userId }, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY);

		expect(tokens).toHaveProperty('accessToken');
		expect(tokens).toHaveProperty('refreshToken');
	});
});
