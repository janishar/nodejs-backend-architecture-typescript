import '../../../database/mock';
import '../../../cache/mock';
import { addHeaders } from '../../../auth/authentication/mock';

// the mock for this class should be below all other mock imports
import {
  mockKeystoreCreate,
  mockUserFindByEmail,
  createTokensSpy,
  bcryptCompareSpy,
  USER_EMAIL,
  USER_PASSWORD,
  USER_PASSWORD_HASH,
} from './mock';

import supertest from 'supertest';
import app from '../../../../src/app';

describe('Login basic route', () => {
  const endpoint = '/login/basic';
  const request = supertest(app);

  beforeEach(() => {
    mockKeystoreCreate.mockClear();
    mockUserFindByEmail.mockClear();
    bcryptCompareSpy.mockClear();
    createTokensSpy.mockClear();
  });

  it('Should send error when empty body is sent', async () => {
    const response = await addHeaders(request.post(endpoint));
    expect(response.status).toBe(400);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptCompareSpy).not.toHaveBeenCalled();
    expect(mockKeystoreCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when email is only sent', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({ email: USER_EMAIL }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptCompareSpy).not.toHaveBeenCalled();
    expect(mockKeystoreCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when password is only sent', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({ password: USER_PASSWORD }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/email/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptCompareSpy).not.toHaveBeenCalled();
    expect(mockKeystoreCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when email is not valid format', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({ email: '123' }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/valid email/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptCompareSpy).not.toHaveBeenCalled();
    expect(mockKeystoreCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when password is not valid format', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: '123@abc.com',
        password: '123',
      }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password length/);
    expect(response.body.message).toMatch(/6 char/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptCompareSpy).not.toHaveBeenCalled();
    expect(mockKeystoreCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when user not registered for email', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: '123@abc.com',
        password: '123456',
      }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not registered/);
    expect(mockUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(bcryptCompareSpy).not.toHaveBeenCalled();
    expect(mockKeystoreCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error for wrong password', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: USER_EMAIL,
        password: '123456',
      }),
    );
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authentication failure/i);
    expect(mockUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(bcryptCompareSpy).toHaveBeenCalledTimes(1);
    expect(mockKeystoreCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send success response for correct credentials', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      }),
    );
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

    expect(mockUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(mockKeystoreCreate).toHaveBeenCalledTimes(1);
    expect(bcryptCompareSpy).toHaveBeenCalledTimes(1);
    expect(createTokensSpy).toHaveBeenCalledTimes(1);

    expect(bcryptCompareSpy).toHaveBeenCalledWith(USER_PASSWORD, USER_PASSWORD_HASH);
  });
});
