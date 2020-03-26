import { Schema, model, Document } from 'mongoose';
import Logger from '../../utils/Logger2';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export const enum RoleCode {
	LEARNER = 'LEARNER',
	WRITER = 'WRITER',
	EDITOR = 'EDITOR',
	ADMIN = 'ADMIN',
}

export interface IRole extends Document {
	code: string;
	status?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const schema = new Schema(
	{
		code: {
			type: Schema.Types.String,
			required: true,
			enum: [
				RoleCode.LEARNER,
				RoleCode.WRITER,
				RoleCode.EDITOR,
				RoleCode.ADMIN,
			]
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

const Role = model<IRole>(DOCUMENT_NAME, schema, COLLECTION_NAME);

export default Role;