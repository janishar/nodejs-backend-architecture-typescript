import '../../database/mock';
import '../../cache/mock';
import { API_KEY, mockFindApiKey } from './mock'; // mock should be imported on the top
import app from '../../../src/app';
import supertest from 'supertest';

describe('apikey validation', () => {
  const endpoint = '/dummy/test';
  const request = supertest(app);

  beforeEach(() => {
    mockFindApiKey.mockClear();
  });

  it('Should response with 400 if x-api-key header is not passed', async () => {
    const response = await request.get(endpoint).timeout(2000);
    expect(response.status).toBe(400);
    expect(mockFindApiKey).not.toHaveBeenCalled();
  });

  it('Should response with 403 if wrong x-api-key header is passed', async () => {
    const wrongApiKey = '123';
    const response = await request
      .get(endpoint)
      .set('x-api-key', wrongApiKey)
      .timeout(2000);
    expect(response.status).toBe(403);
    expect(mockFindApiKey).toHaveBeenCalledTimes(1);
    expect(mockFindApiKey).toHaveBeenCalledWith(wrongApiKey);
  });

  it('Should response with 404 if correct x-api-key header is passed and when route is not handelled', async () => {
    const response = await request
      .get(endpoint)
      .set('x-api-key', API_KEY)
      .timeout(2000);
    expect(response.status).toBe(404);
    expect(mockFindApiKey).toHaveBeenCalledTimes(1);
    expect(mockFindApiKey).toHaveBeenCalledWith(API_KEY);
  });
});
