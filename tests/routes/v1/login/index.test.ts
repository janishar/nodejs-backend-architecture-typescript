import { addHeaders } from '../../../auth/authentication/mock';

// the mock for this class should be below all other mock imports
import {
	mockKeystoreCreate, mockUserFindByEmail, createTokensSpy,
	USER_EMAIL, USER_PASSWORD
} from './mock';

import supertest from 'supertest';
import app from '../../../../src/app';

describe('Login Route', () => {

	const endpoint = '/v1/login/basic';
	const request = supertest(app);

	beforeEach(() => {
		mockKeystoreCreate.mockClear();
		mockUserFindByEmail.mockClear();
		createTokensSpy.mockClear();
	});

	it('Should throw error when empty body is sent', async () => {
		const response = await addHeaders(request.post(endpoint));
		expect(response.status).toBe(400);
		expect(mockUserFindByEmail).toBeCalledTimes(0);
		expect(mockKeystoreCreate).toBeCalledTimes(0);
		expect(createTokensSpy).toBeCalledTimes(0);
	});

	it('Should throw error when email is only sent', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({ email: USER_EMAIL })
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/password/);
		expect(mockUserFindByEmail).toBeCalledTimes(0);
		expect(mockKeystoreCreate).toBeCalledTimes(0);
		expect(createTokensSpy).toBeCalledTimes(0);
	});

	it('Should throw error when password is only sent', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({ password: USER_PASSWORD })
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/email/);
		expect(mockUserFindByEmail).toBeCalledTimes(0);
		expect(mockKeystoreCreate).toBeCalledTimes(0);
		expect(createTokensSpy).toBeCalledTimes(0);
	});

	it('Should throw error when email is not valid format', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({ email: '123' })
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/valid email/);
		expect(mockUserFindByEmail).toBeCalledTimes(0);
		expect(mockKeystoreCreate).toBeCalledTimes(0);
		expect(createTokensSpy).toBeCalledTimes(0);
	});

	it('Should throw error when password is not valid format', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({
				email: '123@abc.com',
				password: '123'
			}));
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/password length/);
		expect(response.body.message).toMatch(/6 char/);
		expect(mockUserFindByEmail).toBeCalledTimes(0);
		expect(mockKeystoreCreate).toBeCalledTimes(0);
		expect(createTokensSpy).toBeCalledTimes(0);
	});

	it('Should throw error when user not registered for email', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({
				email: '123@abc.com',
				password: '123456',
			}));
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/not registered/);
		expect(mockUserFindByEmail).toBeCalledTimes(1);
		expect(mockKeystoreCreate).toBeCalledTimes(0);
		expect(createTokensSpy).toBeCalledTimes(0);
	});

	it('Should throw error for wrong password', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({
				email: USER_EMAIL,
				password: '123456',
			}));
		expect(response.status).toBe(401);
		expect(response.body.message).toMatch(/authentication failure/i);
		expect(mockUserFindByEmail).toBeCalledTimes(1);
		expect(mockKeystoreCreate).toBeCalledTimes(0);
		expect(createTokensSpy).toBeCalledTimes(0);
	});

	it('Should send success response for correct credentials', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({
				email: USER_EMAIL,
				password: USER_PASSWORD,
			}));
		expect(response.status).toBe(200);
		expect(response.body.message).toMatch(/Success/i);
		expect(response.body.data).toBeDefined();

		expect(response.body.data.user).toHaveProperty('_id');
		expect(response.body.data.user).toHaveProperty('name');
		expect(response.body.data.user).toHaveProperty('roles');
		expect(response.body.data.user).toHaveProperty('profilePicUrl');

		expect(response.body.data.tokens).toBeDefined();
		expect(response.body.data.tokens).toHaveProperty('accessToken');
		expect(response.body.data.tokens).toHaveProperty('refreshToken');

		expect(mockUserFindByEmail).toBeCalledTimes(1);
		expect(mockKeystoreCreate).toBeCalledTimes(1);
		expect(createTokensSpy).toBeCalledTimes(1);
	});
});