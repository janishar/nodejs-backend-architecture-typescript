import '../../database/mock';
import '../../cache/mock';

import {
  ACCESS_TOKEN,
  addHeaders,
  addAuthHeaders,
  mockUserFindById,
  mockJwtValidate,
  mockKeystoreFindForKey,
  getAccessTokenSpy,
} from './mock';

import app from '../../../src/app';
import supertest from 'supertest';

describe('authentication validation', () => {
  const endpoint = '/profile/my/test';
  const request = supertest(app);

  beforeEach(() => {
    getAccessTokenSpy.mockClear();
    mockJwtValidate.mockClear();
    mockUserFindById.mockClear();
    mockKeystoreFindForKey.mockClear();
  });

  it('Should response with 400 if Authorization header is not passed', async () => {
    const response = await addHeaders(request.get(endpoint));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/authorization/);
    expect(getAccessTokenSpy).not.toHaveBeenCalled();
  });

  it('Should response with 400 if Authorization header do not have Bearer', async () => {
    const response = await addHeaders(request.get(endpoint)).set(
      'Authorization',
      '123',
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/authorization/);
    expect(getAccessTokenSpy).not.toHaveBeenCalled();
  });

  it('Should response with 401 if wrong Authorization header is provided', async () => {
    const response = await addHeaders(request.get(endpoint)).set(
      'Authorization',
      'Bearer 123',
    );
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/token/i);
    expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(getAccessTokenSpy).toHaveBeenCalledWith('Bearer 123');
    expect(getAccessTokenSpy).toHaveReturnedWith('123');
    expect(mockJwtValidate).toHaveBeenCalledTimes(1);
    expect(mockJwtValidate).toHaveBeenCalledWith('123');
    expect(mockUserFindById).not.toHaveBeenCalled();
  });

  it('Should response with 404 if correct Authorization header is provided', async () => {
    const response = await addAuthHeaders(request.get(endpoint));
    expect(response.body.message).not.toMatch(/not registered/);
    expect(response.body.message).not.toMatch(/token/i);
    expect(response.status).toBe(404);
    expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(getAccessTokenSpy).toHaveBeenCalledWith(`Bearer ${ACCESS_TOKEN}`);
    expect(getAccessTokenSpy).toHaveReturnedWith(ACCESS_TOKEN);
    expect(mockJwtValidate).toHaveBeenCalledTimes(1);
    expect(mockJwtValidate).toHaveBeenCalledWith(ACCESS_TOKEN);
    expect(mockUserFindById).toHaveBeenCalledTimes(1);
    expect(mockKeystoreFindForKey).toHaveBeenCalledTimes(1);
  });
});
