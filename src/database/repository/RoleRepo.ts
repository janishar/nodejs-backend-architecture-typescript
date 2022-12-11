import Role, { RoleModel } from '../model/Role';

export default class RoleRepo {
  public static findByCode(code: string): Promise<Role | null> {
    return RoleModel.findOne({ code: code, status: true }).lean().exec();
  }

  public static findByCodes(codes: string[]): Promise<Role[]> {
    return RoleModel.find({ code: { $in: codes }, status: true })
      .lean()
      .exec();
  }
}
