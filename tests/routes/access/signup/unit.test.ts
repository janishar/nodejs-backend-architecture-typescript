// importing any mock file let the jest load all the mocks defined in that file
import '../../../database/mock';
import '../../../cache/mock';
import { addHeaders } from '../../../auth/authentication/mock';
import {
  mockUserFindByEmail,
  createTokensSpy,
  USER_EMAIL,
  USER_PASSWORD,
} from '../login/mock';

// import the mock for this file below all mock imports
import {
  mockUserCreate,
  bcryptHashSpy,
  USER_NAME,
  USER_PROFILE_PIC,
} from './mock';

import supertest from 'supertest';
import app from '../../../../src/app';

describe('Signup basic route', () => {
  const endpoint = '/signup/basic';
  const request = supertest(app);

  const email = 'abc@xyz.com';

  beforeEach(() => {
    mockUserFindByEmail.mockClear();
    mockUserCreate.mockClear();
    bcryptHashSpy.mockClear();
    createTokensSpy.mockClear();
  });

  it('Should send error when empty body is sent', async () => {
    const response = await addHeaders(request.post(endpoint));
    expect(response.status).toBe(400);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptHashSpy).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when email is not sent', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        name: USER_NAME,
        password: USER_PASSWORD,
        profilePicUrl: USER_PROFILE_PIC,
      }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/email/);
    expect(response.body.message).toMatch(/required/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptHashSpy).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when password is not sent', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: email,
        name: USER_NAME,
        profilePicUrl: USER_PROFILE_PIC,
      }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password/);
    expect(response.body.message).toMatch(/required/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptHashSpy).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when name is not sent', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: email,
        password: USER_PASSWORD,
        profilePicUrl: USER_PROFILE_PIC,
      }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/name/);
    expect(response.body.message).toMatch(/required/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptHashSpy).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when email is not valid format', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: 'abc',
        name: USER_NAME,
        password: USER_PASSWORD,
        profilePicUrl: USER_PROFILE_PIC,
      }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/valid email/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptHashSpy).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when password is not valid format', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: email,
        name: USER_NAME,
        password: '123',
        profilePicUrl: USER_PROFILE_PIC,
      }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password length/);
    expect(response.body.message).toMatch(/6 char/);
    expect(mockUserFindByEmail).not.toHaveBeenCalled();
    expect(bcryptHashSpy).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send error when user is registered for email', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: USER_EMAIL,
        name: USER_NAME,
        password: USER_PASSWORD,
        profilePicUrl: USER_PROFILE_PIC,
      }),
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/already registered/);
    expect(mockUserFindByEmail).toHaveBeenCalledTimes(1);
    expect(bcryptHashSpy).not.toHaveBeenCalled();
    expect(mockUserCreate).not.toHaveBeenCalled();
    expect(createTokensSpy).not.toHaveBeenCalled();
  });

  it('Should send success response for correct data', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: email,
        name: USER_NAME,
        password: USER_PASSWORD,
        profilePicUrl: USER_PROFILE_PIC,
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
    expect(bcryptHashSpy).toHaveBeenCalledTimes(1);
    expect(mockUserCreate).toHaveBeenCalledTimes(1);
    expect(createTokensSpy).toHaveBeenCalledTimes(1);

    expect(bcryptHashSpy).toHaveBeenCalledWith(USER_PASSWORD, 10);
  });
});
