import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { USER_ID_WRITER } from '../../../../auth/authorization/mock';

import {
	mockBlogCreate, mockBlogFindUrlIfExists, BLOG_ID, BLOG_URL
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';

describe('Writer blog routes', () => {

	beforeEach(() => {
		mockBlogCreate.mockClear();
		mockBlogFindUrlIfExists.mockClear();
	});

	const request = supertest(app);
	const endpoint = '/v1/writer/blog';

	it('Should send error if the user do have writer role', async () => {
		const response = await addAuthHeaders(request.post(endpoint));
		expect(response.status).toBe(401);
		expect(response.body.message).toMatch(/permission denied/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog title not sent', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				description: 'description',
				text: 'text',
				blogUrl: 'blogUrl',
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/title/i);
		expect(response.body.message).toMatch(/required/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog description not sent', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				text: 'text',
				blogUrl: 'blogUrl',
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/description/i);
		expect(response.body.message).toMatch(/required/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog text not sent', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				description: 'description',
				blogUrl: 'blogUrl',
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/text/i);
		expect(response.body.message).toMatch(/required/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog blogUrl not sent', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				description: 'description',
				text: 'text',
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/blogUrl/i);
		expect(response.body.message).toMatch(/required/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog blogUrl is not in accepted format', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				description: 'description',
				text: 'text',
				blogUrl: 'https://abc.com/xyz'
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/blogUrl/i);
		expect(response.body.message).toMatch(/invalid/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog imgUrl is not an url', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				description: 'description',
				text: 'text',
				blogUrl: 'blogUrl',
				imgUrl: 'abc'
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/imgUrl/i);
		expect(response.body.message).toMatch(/valid uri/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog score is invalid', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				description: 'description',
				text: 'text',
				blogUrl: 'blogUrl',
				score: 'abc'
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/must be a number/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog tags is invalid', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				description: 'description',
				text: 'text',
				blogUrl: 'blogUrl',
				tags: 'abc'
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/must be/i);
		expect(response.body.message).toMatch(/array/i);
		expect(mockBlogFindUrlIfExists).not.toBeCalled();
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send error if blog already exists for blogUrl', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				description: 'description',
				text: 'text',
				blogUrl: BLOG_URL
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(/already exists/i);
		expect(mockBlogFindUrlIfExists).toBeCalledTimes(1);
		expect(mockBlogCreate).not.toBeCalled();
	});

	it('Should send success if blog data is correct', async () => {
		const response = await addAuthHeaders(
			request.post(endpoint).send({
				title: 'title',
				description: 'description',
				text: 'text',
				blogUrl: 'blogUrl',
				imgUrl: 'https://abc.com/xyz',
				score: 0.01,
				tags: ['ABC'],
			}),
			USER_ID_WRITER
		);
		expect(response.status).toBe(200);
		expect(response.body.message).toMatch(/created success/i);
		expect(mockBlogFindUrlIfExists).toBeCalledTimes(1);
		expect(mockBlogCreate).toBeCalledTimes(1);
		expect(response.body.data).toMatchObject({ _id: BLOG_ID.toHexString() });
	});
});