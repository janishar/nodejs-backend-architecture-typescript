import { addHeaders } from '../../../auth/authentication/mock';

// the mock for this class should be below all other mock imports
import {
	mockKeystoreCreate, mockUserFindByEmail, USER_EMAIL, USER_PASSWORD
} from './mock';

import supertest from 'supertest';
import app from '../../../../src/app';

describe('Login Route', () => {

	const endpoint = '/v1/login/basic';
	const request = supertest(app);

	beforeAll(() => {
		mockKeystoreCreate.mockClear();
		mockUserFindByEmail.mockClear();
	});

	it('Should throw error when empty body is sent', async () => {
		const response = await addHeaders(request.post(endpoint));
		expect(response.status).toBe(400);
	});

	it('Should throw error when email is only sent', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({ email: USER_EMAIL })
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/password/);
	});

	it('Should throw error when password is only sent', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({ password: USER_PASSWORD })
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/email/);
	});

	it('Should throw error when email is not valid format', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({ email: '123' })
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/valid email/);
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
	});

	it('Should throw error when user not registered for email', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({
				email: '123@abc.com',
				password: '123456',
			}));
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/not registered/);
	});

	it('Should throw error for wrong password', async () => {
		const response = await addHeaders(request.post(endpoint)
			.send({
				email: USER_EMAIL,
				password: '123456',
			}));
		expect(response.status).toBe(401);
		expect(response.body.message).toMatch(/authentication failure/i);
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
	});
});