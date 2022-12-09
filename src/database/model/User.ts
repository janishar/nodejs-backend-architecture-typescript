import { model, Schema, Document } from 'mongoose';
import Role from './Role';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document {
  name: string;
  email?: string;
  password?: string;
  profilePicUrl?: string;
  roles: Role[];
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

Schema.Types.String.set('trim', true);
const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      select: false,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    profilePicUrl: {
      type: Schema.Types.String,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      required: true,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
  },
);

schema.set('timestamps', true);
export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
