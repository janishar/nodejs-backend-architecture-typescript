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
    expect(getAccessTokenSpy).not.toBeCalled();
  });

  it('Should response with 400 if Authorization header do not have Bearer', async () => {
    const response = await addHeaders(request.get(endpoint)).set(
      'Authorization',
      '123',
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/authorization/);
    expect(getAccessTokenSpy).not.toBeCalled();
  });

  it('Should response with 401 if wrong Authorization header is provided', async () => {
    const response = await addHeaders(request.get(endpoint)).set(
      'Authorization',
      'Bearer 123',
    );
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/token/i);
    expect(getAccessTokenSpy).toBeCalledTimes(1);
    expect(getAccessTokenSpy).toBeCalledWith('Bearer 123');
    expect(getAccessTokenSpy).toReturnWith('123');
    expect(mockJwtValidate).toBeCalledTimes(1);
    expect(mockJwtValidate).toBeCalledWith('123');
    expect(mockUserFindById).not.toBeCalled();
  });

  it('Should response with 404 if correct Authorization header is provided', async () => {
    const response = await addAuthHeaders(request.get(endpoint));
    expect(response.body.message).not.toMatch(/not registered/);
    expect(response.body.message).not.toMatch(/token/i);
    expect(response.status).toBe(404);
    expect(getAccessTokenSpy).toBeCalledTimes(1);
    expect(getAccessTokenSpy).toBeCalledWith(`Bearer ${ACCESS_TOKEN}`);
    expect(getAccessTokenSpy).toReturnWith(ACCESS_TOKEN);
    expect(mockJwtValidate).toBeCalledTimes(1);
    expect(mockJwtValidate).toBeCalledWith(ACCESS_TOKEN);
    expect(mockUserFindById).toBeCalledTimes(1);
    expect(mockKeystoreFindForKey).toBeCalledTimes(1);
  });
});
