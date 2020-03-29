import { mockUserFindByEmail } from '../login/mock';
import { IUser } from '../../../../src/database/model/User';
import { IKeystore } from '../../../../src/database/model/Keystore';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

export const USER_NAME = 'abc';
export const USER_PROFILE_PIC = 'https://abc.com/xyz';

export const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');


export const mockUserCreate = jest.fn(async (user: IUser, accessTokenKey: string, refreshTokenKey: string, roleCode: string)
	: Promise<{ user: IUser, keystore: IKeystore }> => {
	user._id = new Types.ObjectId();
	user.roles = [];
	return {
		user: user,
		keystore: <IKeystore>{
			_id: new Types.ObjectId(),
			client: user,
			primaryKey: 'abc',
			secondaryKey: 'xyz'
		}
	};
});

jest.mock('../../../../src/database/repository/UserRepo', () => ({
	get findByEmail() { return mockUserFindByEmail; }, // utilising already defined mock
	get create() { return mockUserCreate; }
}));