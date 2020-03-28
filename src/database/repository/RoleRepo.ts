import Role, { IRole } from '../model/Role';

export default class RoleRepo {

	public static findByCode(code: string): Promise<IRole> {
		return Role.findOne({ code: code, status: true }).lean<IRole>().exec();
	}
}