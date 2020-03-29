import { USER_ID } from '../../../auth/authentication/mock';
import { IKeystore } from '../../../../src/database/model/Keystore';
import { IUser } from '../../../../src/database/model/User';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

export const USER_EMAIL = 'random@test.com';
export const USER_PASSWORD = 'abc123';
export const USER_PASSWORD_HASH = bcrypt.hashSync(USER_PASSWORD, 10);

export const mockKeystoreCreate =
	jest.fn(
		async (client: IUser, primaryKey: string, secondaryKey: string): Promise<IKeystore> => {
			return <IKeystore>{
				_id: new Types.ObjectId(),
				client: client,
				primaryKey: primaryKey,
				secondaryKey: secondaryKey
			};
		});

export const mockUserFindByEmail =
	jest.fn(async (email: string): Promise<IUser> => {
		if (email === USER_EMAIL) return <IUser>{
			_id: USER_ID,
			email: USER_EMAIL,
			password: USER_PASSWORD_HASH,
			name: 'abc',
			profilePicUrl: 'abc',
			roles: []
		};
		return null;
	});

jest.mock('../../../../src/database/repository/KeystoreRepo', () => ({
	get create() { return mockKeystoreCreate; }
}));


jest.mock('../../../../src/database/repository/UserRepo', () => ({
	get findByEmail() { return mockUserFindByEmail; }
}));

jest.unmock('../../../../src/auth/authUtils');