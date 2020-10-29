import Keystore, { KeystoreModel } from '../model/Keystore';
import { Types } from 'mongoose';
import User from '../model/User';

export default class KeystoreRepo {
  public static findforKey(client: User, key: string): Promise<Keystore | null> {
    return KeystoreModel.findOne({ client: client, primaryKey: key, status: true }).exec();
  }

  public static remove(id: Types.ObjectId): Promise<Keystore | null> {
    return KeystoreModel.findByIdAndRemove(id).lean<Keystore>().exec();
  }

  public static find(
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | null> {
    return KeystoreModel.findOne({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
    })
      .lean<Keystore>()
      .exec();
  }

  public static async create(
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore> {
    const now = new Date();
    const keystore = await KeystoreModel.create({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
      createdAt: now,
      updatedAt: now,
    } as Keystore);
    return keystore.toObject();
  }
}
