import supertest from 'supertest';
import app from '../../src/app';
import ApiKeyRepo from '../../src/database/repository/ApiKeyRepo';
import { IApiKey } from '../../src/database/model/ApiKey';

describe('apikey validation', () => {

	const request = supertest(app);
	const API_KEY = 'abc';

	const mockFindApiKey = jest.fn(async key => {
		if (key == API_KEY) return <IApiKey>{ key: API_KEY };
		else return null;
	});

	ApiKeyRepo.findByKey = mockFindApiKey;

	beforeEach(() => {
		mockFindApiKey.mockClear();
	});

	it('Should fail with 400 if api-key header is not passed', async () => {
		const response = await request.get('/v1/test');
		expect(response.status).toBe(400);
		expect(mockFindApiKey).toBeCalledTimes(0);
	});

	it('Should fail with 403 if wrong api-key header is passed', async () => {
		const wrongApiKey = '123';
		const response = await request
			.get('/v1')
			.set('x-api-key', wrongApiKey);
		expect(response.status).toBe(403);
		expect(mockFindApiKey).toBeCalledTimes(1);
		expect(mockFindApiKey).toBeCalledWith(wrongApiKey);
	});

	it('Should pass with 404 if correct api-key header is passed and when route is not handelled', async () => {
		const response = await request
			.get('/v1')
			.set('x-api-key', API_KEY);
		expect(response.status).toBe(404);
		expect(mockFindApiKey).toBeCalledTimes(1);
		expect(mockFindApiKey).toBeCalledWith(API_KEY);
	});
});