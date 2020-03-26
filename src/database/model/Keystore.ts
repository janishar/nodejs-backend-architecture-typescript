import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export const DOCUMENT_NAME = 'Keystore';
export const COLLECTION_NAME = 'keystores';

export interface IKeystore extends Document {
	client: IUser;
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
			index: true
		},
		primaryKey: {
			type: Schema.Types.String,
			required: true,
			index: true
		},
		secondaryKey: {
			type: Schema.Types.String,
			required: true,
			index: true
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

const Keystore = model<IKeystore>(DOCUMENT_NAME, schema, COLLECTION_NAME);

export default Keystore;