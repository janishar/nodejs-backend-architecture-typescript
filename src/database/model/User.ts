import { model, Schema, Document, Types } from 'mongoose';
import { IRole } from './Role';
import Logger from '../../utils/Logger';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export interface IUser extends Document {
	name: string;
	email?: string;
	password?: string;
	profilePicUrl?: string;
	roles: IRole[];
	verified?: boolean;
	status?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const userSchema = new Schema(
	{
		name: {
			type: Schema.Types.String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		email: {
			type: Schema.Types.String,
			required: true,
			unique: true,
			trim: true,
			select: false
		},
		password: {
			type: Schema.Types.String,
			select: false
		},
		profilePicUrl: {
			type: Schema.Types.String,
			trim: true
		},
		roles: {
			type: [{
				type: Schema.Types.ObjectId,
				ref: 'Role'
			}],
			required: true,
			select: false
		},
		verified: {
			type: Schema.Types.Boolean,
			default: false
		},
		status: {
			type: Schema.Types.Boolean,
			default: true
		},
		createdAt: {
			type: Date,
			required: true,
			select: false
		},
		updatedAt: {
			type: Date,
			required: true,
			select: false
		}
	},
	{
		versionKey: false
	});

const User = model<IUser>(DOCUMENT_NAME, userSchema, COLLECTION_NAME);
User.createIndexes(err => Logger.error(err));

export default User;