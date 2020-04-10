import {
	USER_ID, ACCESS_TOKEN, addHeaders, addAuthHeaders,
	mockUserFindById, mockJwtValidate, mockJwtDecode, mockKeystoreFindForKey
} from './mock';

import app from '../../../src/app';
import supertest from 'supertest';

describe('authentication validation', () => {

	const endpoint = '/v1/profile/my/test';
	const request = supertest(app);

	beforeEach(() => {
		mockUserFindById.mockClear();
		mockJwtValidate.mockClear();
		mockJwtDecode.mockClear();
		mockKeystoreFindForKey.mockClear();
	});

	it('Should response with 400 if Authorization header is not passed', async () => {
		const response = await addHeaders(request.get(endpoint));
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/authorization/);
		expect(mockJwtDecode).not.toBeCalled();
		expect(mockUserFindById).not.toBeCalled();
	});


	it('Should response with 400 if Authorization header do not have Bearer', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('Authorization', '123');
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/authorization/);
		expect(mockJwtDecode).not.toBeCalled();
		expect(mockUserFindById).not.toBeCalled();
	});

	it('Should response with 401 if wrong Authorization header is provided', async () => {
		const response = await addHeaders(request.get(endpoint))
			.set('Authorization', 'Bearer 123');
		expect(response.status).toBe(401);
		expect(response.body.message).toMatch(/token/i);
		expect(mockJwtDecode).toBeCalledTimes(1);
		expect(mockJwtDecode).toBeCalledWith('123');
		expect(mockUserFindById).not.toBeCalled();
	});

	it('Should response with 404 if correct Authorization header is provided', async () => {
		const response = await addAuthHeaders(request.get(endpoint));
		expect(response.body.message).not.toMatch(/not registered/);
		expect(response.body.message).not.toMatch(/token/i);
		expect(response.status).toBe(404);
		expect(mockJwtDecode).toBeCalledTimes(1);
		expect(mockJwtDecode).toBeCalledWith(ACCESS_TOKEN);
		expect(mockUserFindById).toBeCalledTimes(1);
		expect(mockJwtValidate).toBeCalledTimes(1);
	});
});