import User, { IUser } from '../model/User';
import Role, { IRole } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import { IKeystore } from '../model/Keystore';

export default class UserRepo {

	// contains critical information of the user
	public static findById(id: Types.ObjectId): Promise<IUser> {
		return User.findOne({ _id: id, status: true })
			.select('+email +password +roles')
			.populate({
				path: 'roles',
				match: { status: true }
			})
			.lean<IUser>()
			.exec();
	}

	public static findByEmail(email: string): Promise<IUser> {
		return User.findOne({ email: email, status: true })
			.select('+email +password +roles')
			.populate({
				path: 'roles',
				match: { status: true },
				select: { code: 1 }
			})
			.lean<IUser>()
			.exec();
	}

	public static findProfileById(id: Types.ObjectId): Promise<IUser> {
		return User.findOne({ _id: id, status: true })
			.select('+roles')
			.populate({
				path: 'roles',
				match: { status: true },
				select: { code: 1 }
			})
			.lean<IUser>()
			.exec();
	}

	public static findPublicProfileById(id: Types.ObjectId): Promise<IUser> {
		return User.findOne({ _id: id, status: true }).lean<IUser>().exec();
	}

	public static async create(user: IUser, accessTokenKey: string, refreshTokenKey: string, roleCode: string)
		: Promise<{ user: IUser, keystore: IKeystore }> {
		const now = new Date();

		const role = await Role.findOne({ code: roleCode }).select('+email +password').lean<IRole>().exec();
		if (!role) throw new InternalError('Role must be defined');

		user.roles = [role._id];
		user.createdAt = user.updatedAt = now;
		const createdUser = await User.create(user);
		const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
		return { user: createdUser.toObject(), keystore: keystore };
	}

	public static async update(user: IUser, accessTokenKey: string, refreshTokenKey: string)
		: Promise<{ user: IUser, keystore: IKeystore }> {
		user.updatedAt = new Date();
		const result = await User.updateOne({ _id: user._id }, { $set: { ...user }, }).lean().exec();
		const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
		return { user: user, keystore: keystore };
	}

	public static updateInfo(user: IUser): Promise<any> {
		user.updatedAt = new Date();
		return User.updateOne({ _id: user._id }, { $set: { ...user }, }).lean().exec();
	}
}