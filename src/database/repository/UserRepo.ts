import User, { UserModel } from '../model/User';
import { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';

export default class UserRepo {
  public static async exists(id: Types.ObjectId): Promise<boolean> {
    const user = await UserModel.exists({ _id: id, status: true });
    return user !== null && user !== undefined;
  }

  public static findPrivateProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+email')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  // contains critical information of the user
  public static findById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
      })
      .lean()
      .exec();
  }

  public static findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email: email })
      .select(
        '+email +password +roles +gender +dob +grade +country +state +city +school +bio +hobbies',
      )
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean()
      .exec();
  }

  public static findFieldsById(id: Types.ObjectId, ...fields: string[]): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true }, [...fields])
      .lean()
      .exec();
  }

  public static findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true }).lean().exec();
  }

  public static async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    const role = await RoleModel.findOne({ code: roleCode }).select('+code').lean().exec();
    if (!role) throw new InternalError('Role must be defined');

    user.roles = [role];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(createdUser, accessTokenKey, refreshTokenKey);
    return {
      user: { ...createdUser.toObject(), roles: user.roles },
      keystore: keystore,
    };
  }

  public static async update(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
    const keystore = await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
  }

  public static updateInfo(user: User): Promise<any> {
    user.updatedAt = new Date();
    return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
  }
}
