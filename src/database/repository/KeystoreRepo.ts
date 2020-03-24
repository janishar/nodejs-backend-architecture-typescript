import Keystore, { IKeystore } from '../model/Keystore';
import { Types } from 'mongoose';
import { IUser } from '../model/User';

export default class KeystoreRepository {

	public static findforKey(client: IUser, key: string): Promise<IKeystore> {
		return Keystore.findOne({ client: client, primaryKey: key, status: true }).exec();
	}

	public static remove(id: Types.ObjectId): Promise<IKeystore> {
		return Keystore.findByIdAndRemove(id).lean<IKeystore>().exec();
	}

	public static find(client: IUser, primaryKey: string, secondaryKey: string): Promise<IKeystore> {
		return Keystore
			.findOne({ client: client, primaryKey: primaryKey, secondaryKey: secondaryKey })
			.lean<IKeystore>()
			.exec();
	}

	public static async create(client: IUser, primaryKey: string, secondaryKey: string)
		: Promise<IKeystore> {
		const now = new Date();
		const keystore = await Keystore.create(<IKeystore>{
			client: client,
			primaryKey: primaryKey,
			secondaryKey: secondaryKey,
			createdAt: now,
			updatedAt: now
		});
		return keystore.toObject();
	}
}