jest.resetAllMocks(); // make sure we do not have any mocks set from unit tests

import supertest from 'supertest';
import app from '../../../../src/app';
import UserRepo from '../../../../src/database/repository/UserRepo';
import KeystoreRepo from '../../../../src/database/repository/KeystoreRepo';
import User, { UserModel } from '../../../../src/database/model/User';
import bcrypt from 'bcrypt';
import * as authUtils from '../../../../src/auth/authUtils';
import Role, { RoleCode } from '../../../../src/database/model/Role';
import { Types } from 'mongoose';
import ApiKey, { ApiKeyModel } from '../../../../src/database/model/ApiKey';
import { connection } from '../../../../src/database';
import cache from '../../../../src/cache';

export const createTokensSpy = jest.spyOn(authUtils, 'createTokens');
export const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');
export const userFindByEmailSpy = jest.spyOn(UserRepo, 'findByEmail');
export const keystoreCreateSpy = jest.spyOn(KeystoreRepo, 'create');

describe('Login basic route', () => {
  const endpoint = '/login/basic';
  const request = supertest(app);
  const password = '123456';

  let user: User;
  let apikey: ApiKey | null;

  beforeAll(async () => {
    await UserModel.remove({}); // delete all data from user table
    user = await UserModel.create({
      name: 'abc',
      email: 'abc@xyz.com',
      password: bcrypt.hashSync(password, 10),
      status: true,
      updatedAt: new Date(),
      createdAt: new Date(),
      profilePicUrl: 'https:/abc.com/xyz',
      roles: [{ _id: new Types.ObjectId(), code: RoleCode.LEARNER } as Role],
    } as User);
    apikey = await ApiKeyModel.findOne({ status: true });
  });

  afterAll(async () => {
    await UserModel.remove({}); // delete all data from user table
    connection.close();
    cache.disconnect();
  });

  beforeEach(() => {
    userFindByEmailSpy.mockClear();
    keystoreCreateSpy.mockClear();
    bcryptCompareSpy.mockClear();
    createTokensSpy.mockClear();
  });

  it('Should send error when empty body is sent', async () => {
    const response = await addHeaders(request.post(endpoint), apikey);
    expect(response.status).toBe(400);
    expect(userFindByEmailSpy).not.toBeCalled();
    expect(bcryptCompareSpy).not.toBeCalled();
    expect(keystoreCreateSpy).not.toBeCalled();
    expect(createTokensSpy).not.toBeCalled();
  });

  it('Should send error when email is only sent', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({ email: user.email }),
      apikey,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password/);
    expect(userFindByEmailSpy).not.toBeCalled();
    expect(bcryptCompareSpy).not.toBeCalled();
    expect(keystoreCreateSpy).not.toBeCalled();
    expect(createTokensSpy).not.toBeCalled();
  });

  it('Should send error when password is only sent', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({ password: password }),
      apikey,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/email/);
    expect(userFindByEmailSpy).not.toBeCalled();
    expect(bcryptCompareSpy).not.toBeCalled();
    expect(keystoreCreateSpy).not.toBeCalled();
    expect(createTokensSpy).not.toBeCalled();
  });

  it('Should send error when email is not valid format', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({ email: '123' }),
      apikey,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/valid email/);
    expect(userFindByEmailSpy).not.toBeCalled();
    expect(bcryptCompareSpy).not.toBeCalled();
    expect(keystoreCreateSpy).not.toBeCalled();
    expect(createTokensSpy).not.toBeCalled();
  });

  it('Should send error when password is not valid format', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: user.email,
        password: '123',
      }),
      apikey,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password length/);
    expect(response.body.message).toMatch(/6 char/);
    expect(userFindByEmailSpy).not.toBeCalled();
    expect(bcryptCompareSpy).not.toBeCalled();
    expect(keystoreCreateSpy).not.toBeCalled();
    expect(createTokensSpy).not.toBeCalled();
  });

  it('Should send error when user not registered for email', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: '123@abc.com',
        password: password,
      }),
      apikey,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not registered/);
    expect(userFindByEmailSpy).toBeCalledTimes(1);
    expect(bcryptCompareSpy).not.toBeCalled();
    expect(keystoreCreateSpy).not.toBeCalled();
    expect(createTokensSpy).not.toBeCalled();
  });

  it('Should send error for wrong password', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: user.email,
        password: 'abc123',
      }),
      apikey,
    );
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authentication failure/i);
    expect(userFindByEmailSpy).toBeCalledTimes(1);
    expect(bcryptCompareSpy).toBeCalledTimes(1);
    expect(keystoreCreateSpy).not.toBeCalled();
    expect(createTokensSpy).not.toBeCalled();
  });

  it('Should send success response for correct credentials', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: user.email,
        password: password,
      }),
      apikey,
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

    expect(userFindByEmailSpy).toBeCalledTimes(1);
    expect(keystoreCreateSpy).toBeCalledTimes(1);
    expect(bcryptCompareSpy).toBeCalledTimes(1);
    expect(createTokensSpy).toBeCalledTimes(1);

    expect(bcryptCompareSpy).toBeCalledWith(password, user.password);
  });
});

export const addHeaders = (request: any, apikey: ApiKey | null) =>
  request.set('Content-Type', 'application/json').set('x-api-key', apikey?.key);
