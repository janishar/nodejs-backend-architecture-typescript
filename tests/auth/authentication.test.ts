import app from '../../src/app';
import supertest, { SuperTest } from 'supertest';
import ApiKeyRepo from '../../src/database/repository/ApiKeyRepo';
import UserRepo from '../../src/database/repository/UserRepo';
import { IUser } from '../../src/database/model/User';
import { Types } from 'mongoose';
import { mockFindApiKey, API_KEY } from './apikey.test';
import JWT, { ValidationParams, JwtPayload } from '../../src/core/JWT';
import { BadTokenError } from '../../src/core/ApiError';
import { IKeystore } from '../../src/database/model/Keystore';
import KeystoreRepo from '../../src/database/repository/KeystoreRepo';

export const ACCESS_TOKEN = 'xyz';

export const USER_ID = new Types.ObjectId('5e7b95923085872d3c378f35'); // random id with object id format

const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
	if (USER_ID.equals(id)) return <IUser>{ _id: new Types.ObjectId(id) };
	else return null;
});

const mockJwtValidate = jest.fn(
	async (token: string, validations: ValidationParams): Promise<JwtPayload> => {
		if (token == ACCESS_TOKEN) return <JwtPayload>{ prm: 'abcdef' };
		throw new BadTokenError();
	});

const mockKeystoreFindForKey = jest.fn(
	async (client: IUser, key: string): Promise<IKeystore> => (<IKeystore>{ client: client, primaryKey: key }));

jest.mock('../../src/auth/authUtils', () => ({
	get validateTokenData() {
		return jest.fn(async (payload: JwtPayload, userId: Types.ObjectId): Promise<JwtPayload> => payload);
	}
}));

describe('authentication validation', () => {

	const endpoint = '/v1/profile/my/test';
	const request = supertest(app);

	UserRepo.findById = mockUserFindById;
	ApiKeyRepo.findByKey = mockFindApiKey;
	JWT.validate = mockJwtValidate;
	KeystoreRepo.findforKey = mockKeystoreFindForKey;

	beforeEach(() => {
		mockUserFindById.mockClear();
		mockJwtValidate.mockClear();
		mockKeystoreFindForKey.mockClear();
	});

	it('Should response with 400 if x-access-token header is not passed', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('x-user-id', USER_ID.toHexString());
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/x-access-token/);
		expect(mockUserFindById).toBeCalledTimes(0);
	});

	it('Should response with 400 if x-user-id header is not passed', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('x-access-token', ACCESS_TOKEN);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/x-user-id/);
		expect(mockUserFindById).toBeCalledTimes(0);
	});

	it('Should response with 400 if x-user-id header is not mongoose id', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('x-access-token', ACCESS_TOKEN)
			.set('x-user-id', '123');
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/x-user-id/);
		expect(mockUserFindById).toBeCalledTimes(0);
	});

	it('Should response with 401 if wrong x-user-id header is provided', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('x-access-token', ACCESS_TOKEN)
			.set('x-user-id', '5e7b8c22d347fc2407c564a6'); // some random mongoose id
		expect(response.status).toBe(401);
		expect(response.body.message).toMatch(/not registered/);
		expect(mockUserFindById).toBeCalledTimes(1);
	});

	it('Should response with 401 if wrong x-access-token header is provided', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('x-access-token', '123')
			.set('x-user-id', USER_ID);
		expect(response.status).toBe(401);
		expect(response.body.message).toMatch(/token/i);
		expect(mockUserFindById).toBeCalledTimes(1);
	});

	it('Should response with 404 if correct x-access-token and x-user-id header are provided', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('x-access-token', ACCESS_TOKEN)
			.set('x-user-id', USER_ID.toHexString());
		expect(response.body.message).not.toMatch(/not registered/);
		expect(response.body.message).not.toMatch(/token/i);
		expect(response.status).toBe(404);
		expect(mockUserFindById).toBeCalledTimes(1);
	});
});

export const addHeaders = (request: any) => request
	.set('Content-Type', 'application/json')
	.set('x-api-key', API_KEY);

export const addAuthHeaders = (request: any) => request
	.set('Content-Type', 'application/json')
	.set('x-api-key', API_KEY)
	.set('x-access-token', ACCESS_TOKEN)
	.set('x-user-id', USER_ID);