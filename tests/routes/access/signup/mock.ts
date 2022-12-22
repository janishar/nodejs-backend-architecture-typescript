import { mockUserFindByEmail } from '../login/mock';
import User from '../../../../src/database/model/User';
import Keystore from '../../../../src/database/model/Keystore';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

export const USER_NAME = 'abc';
export const USER_PROFILE_PIC = 'https://abc.com/xyz';

export const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');

export const mockUserCreate = jest.fn(
  async (user: User): Promise<{ user: User; keystore: Keystore }> => {
    user._id = new Types.ObjectId();
    user.roles = [];
    return {
      user: user,
      keystore: {
        _id: new Types.ObjectId(),
        client: user,
        primaryKey: 'abc',
        secondaryKey: 'xyz',
      } as Keystore,
    };
  },
);

jest.mock('../../../../src/database/repository/UserRepo', () => ({
  findByEmail: mockUserFindByEmail, // utilising already defined mock
  create: mockUserCreate,
}));
