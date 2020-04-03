// all dependent mock should be on the top
import { USER_ID } from '../authentication/mock';

import { Types } from 'mongoose';
import User from '../../../src/database/model/User';
import Role, { RoleCode } from '../../../src/database/model/Role';


export const LEARNER_ROLE_ID = new Types.ObjectId(); // random id
export const WRITER_ROLE_ID = new Types.ObjectId(); // random id
export const EDITOR_ROLE_ID = new Types.ObjectId(); // random id

export const USER_ID_WRITER = new Types.ObjectId(); // random id
export const USER_ID_EDITOR = new Types.ObjectId(); // random id

export const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
	if (USER_ID.equals(id)) return <User>{
		_id: USER_ID,
		roles: [
			<Role>{ _id: LEARNER_ROLE_ID, code: RoleCode.LEARNER },
		]
	};
	if (USER_ID_WRITER.equals(id)) return <User>{
		_id: USER_ID_WRITER,
		roles: [
			<Role>{ _id: LEARNER_ROLE_ID, code: RoleCode.LEARNER },
			<Role>{ _id: WRITER_ROLE_ID, code: RoleCode.WRITER },
		]
	};
	if (USER_ID_EDITOR.equals(id)) return <User>{
		_id: USER_ID_EDITOR,
		roles: [
			<Role>{ _id: LEARNER_ROLE_ID, code: RoleCode.LEARNER },
			<Role>{ _id: WRITER_ROLE_ID, code: RoleCode.EDITOR },
		]
	};
	else return null;
});

export const mockRoleRepoFindByCode = jest.fn(
	async (code: string): Promise<Role> => {
		switch (code) {
			case RoleCode.WRITER: return <Role>{
				_id: WRITER_ROLE_ID,
				code: RoleCode.WRITER,
				status: true
			};
			case RoleCode.EDITOR: return <Role>{
				_id: EDITOR_ROLE_ID,
				code: RoleCode.EDITOR,
				status: true
			};
			case RoleCode.LEARNER: return <Role>{
				_id: LEARNER_ROLE_ID,
				code: RoleCode.LEARNER,
				status: true
			};
		}
		return null;
	});

jest.mock('../../../src/database/repository/UserRepo', () => ({
	get findById() { return mockUserFindById; }
}));

jest.mock('../../../src/database/repository/RoleRepo', () => ({
	get findByCode() { return mockRoleRepoFindByCode; }
}));