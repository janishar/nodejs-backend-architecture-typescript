import {
	USER_ID, ACCESS_TOKEN, addHeaders, addAuthHeaders,
	mockValidateTokenData, mockUserFindById, mockJwtValidate, mockKeystoreFindForKey
} from './mock';

import app from '../../../src/app';
import supertest from 'supertest';

describe('authentication validation', () => {

	const endpoint = '/v1/profile/my/test';
	const request = supertest(app);

	beforeEach(() => {
		mockValidateTokenData.mockClear();
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
		expect(mockJwtValidate).toBeCalledTimes(1);
	});

	it('Should response with 404 if correct x-access-token and x-user-id header are provided', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('x-access-token', ACCESS_TOKEN)
			.set('x-user-id', USER_ID.toHexString());
		expect(response.body.message).not.toMatch(/not registered/);
		expect(response.body.message).not.toMatch(/token/i);
		expect(response.status).toBe(404);
		expect(mockUserFindById).toBeCalledTimes(1);
		expect(mockValidateTokenData).toBeCalledTimes(1);
		expect(mockJwtValidate).toBeCalledTimes(1);
	});
});