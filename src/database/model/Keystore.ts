import { Schema, model, Document } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Keystore';
export const COLLECTION_NAME = 'keystores';

export default interface Keystore extends Document {
  client: User;
  primaryKey: string;
  secondaryKey: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    primaryKey: {
      type: Schema.Types.String,
      required: true,
    },
    secondaryKey: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index({ client: 1, primaryKey: 1 });
schema.index({ client: 1, primaryKey: 1, secondaryKey: 1 });

export const KeystoreModel = model<Keystore>(DOCUMENT_NAME, schema, COLLECTION_NAME);
