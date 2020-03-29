// all dependent mock should be on the top
import { USER_ID } from '../authentication/mock';

import { Types } from 'mongoose';
import { IUser } from '../../../src/database/model/User';
import { RoleCode, IRole } from '../../../src/database/model/Role';

const LEARNER_ROLE_ID = new Types.ObjectId('5e7b95923085872d3c378f35'); // RONDOM ID
const WRITER_ROLE_ID = new Types.ObjectId('56cb91bdc3464f14678934ca'); // RONDOM ID
const EDITOR_ROLE_ID = new Types.ObjectId('58cd7cfcf9f1150515ee9fb0'); // RONDOM ID

export const mockUserFindByIdForWriter = jest.fn(async (id: Types.ObjectId) => {
	if (USER_ID.equals(id)) return <IUser>{
		_id: USER_ID,
		roles: [
			<IRole>{ _id: LEARNER_ROLE_ID, code: RoleCode.LEARNER },
			<IRole>{ _id: WRITER_ROLE_ID, code: RoleCode.WRITER },
		]
	};
	else return null;
});

export const mockRoleRepoFindByCode = jest.fn(
	async (code: string): Promise<IRole> => {
		switch (code) {
			case RoleCode.WRITER: return <IRole>{
				_id: WRITER_ROLE_ID,
				code: RoleCode.WRITER,
				status: true
			};
			case RoleCode.EDITOR: return <IRole>{
				_id: EDITOR_ROLE_ID,
				code: RoleCode.EDITOR,
				status: true
			};
			case RoleCode.LEARNER: return <IRole>{
				_id: LEARNER_ROLE_ID,
				code: RoleCode.LEARNER,
				status: true
			};
		}
		return null;
	});

jest.mock('../../../src/database/repository/UserRepo', () => ({
	get findById() { return mockUserFindByIdForWriter; }
}));

jest.mock('../../../src/database/repository/RoleRepo', () => ({
	get findByCode() { return mockRoleRepoFindByCode; }
}));