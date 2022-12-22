import { USER_ID } from '../../../auth/authentication/mock';
import Keystore from '../../../../src/database/model/Keystore';
import User from '../../../../src/database/model/User';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import * as authUtils from '../../../../src/auth/authUtils';
import Role from '../../../../src/database/model/Role';

export const USER_EMAIL = 'random@test.com';
export const USER_PASSWORD = 'abc123';
export const USER_PASSWORD_HASH = bcrypt.hashSync(USER_PASSWORD, 10);

export const createTokensSpy = jest.spyOn(authUtils, 'createTokens');

export const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');

export const mockKeystoreCreate = jest.fn(
  async (
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore> => {
    return {
      _id: new Types.ObjectId(),
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
    } as Keystore;
  },
);

export const mockUserFindByEmail = jest.fn(
  async (email: string): Promise<User | null> => {
    if (email === USER_EMAIL)
      return {
        _id: USER_ID,
        email: USER_EMAIL,
        password: USER_PASSWORD_HASH,
        name: 'abc',
        profilePicUrl: 'abc',
        roles: [] as Role[],
      } as User;
    return null;
  },
);

jest.mock('../../../../src/database/repository/KeystoreRepo', () => ({
  create: mockKeystoreCreate,
}));

jest.mock('../../../../src/database/repository/UserRepo', () => ({
  findByEmail: mockUserFindByEmail,
}));

jest.unmock('../../../../src/auth/authUtils'); // remove any override made anywhere
