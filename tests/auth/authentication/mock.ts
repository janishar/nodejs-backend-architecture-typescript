// all dependent mock should be on the top
import { API_KEY } from '../apikey/mock';

import User from '../../../src/database/model/User';
import { Types } from 'mongoose';
import JWT, { ValidationParams, JwtPayload } from '../../../src/core/JWT';
import { BadTokenError } from '../../../src/core/ApiError';
import Keystore from '../../../src/database/model/Keystore';

export const ACCESS_TOKEN = 'xyz';

export const USER_ID = new Types.ObjectId(); // random id with object id format

export const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
	if (USER_ID.equals(id)) return <User>{ _id: new Types.ObjectId(id) };
	else return null;
});

export const mockJwtDecode = jest.fn(async (token: string): Promise<JwtPayload> => {
	if (token == ACCESS_TOKEN) return <JwtPayload>{ sub: USER_ID.toHexString() };
	throw new BadTokenError();
});

export const mockJwtValidate = jest.fn(
	async (token: string, validations: ValidationParams): Promise<JwtPayload> => {
		if (token == ACCESS_TOKEN) return <JwtPayload>{ prm: 'abcdef' };
		throw new BadTokenError();
	});

export const mockKeystoreFindForKey = jest.fn(
	async (client: User, key: string): Promise<Keystore> => (<Keystore>{ client: client, primaryKey: key }));

jest.mock('../../../src/database/repository/UserRepo', () => ({
	get findById() { return mockUserFindById; }
}));

jest.mock('../../../src/database/repository/KeystoreRepo', () => ({
	get findforKey() { return mockKeystoreFindForKey; }
}));

JWT.validate = mockJwtValidate;
JWT.decode = mockJwtDecode;

export const addHeaders = (request: any) => request
	.set('Content-Type', 'application/json')
	.set('x-api-key', API_KEY);

export const addAuthHeaders = (request: any) => request
	.set('Content-Type', 'application/json')
	.set('Authorization', `Bearer ${ACCESS_TOKEN}`)
	.set('x-api-key', API_KEY);
