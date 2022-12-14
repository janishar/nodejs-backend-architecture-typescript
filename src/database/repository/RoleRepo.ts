import Role, { RoleModel } from '../model/Role';

async function findByCode(code: string): Promise<Role | null> {
  return RoleModel.findOne({ code: code, status: true }).lean().exec();
}

async function findByCodes(codes: string[]): Promise<Role[]> {
  return RoleModel.find({ code: { $in: codes }, status: true })
    .lean()
    .exec();
}

export default {
  findByCode,
  findByCodes,
};
