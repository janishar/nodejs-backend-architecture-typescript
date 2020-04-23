import Role, { RoleModel } from '../model/Role';

export default class RoleRepo {
  public static findByCode(code: string): Promise<Role> {
    return RoleModel.findOne({ code: code, status: true }).lean<Role>().exec();
  }
}
