import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'ApiKey';
export const COLLECTION_NAME = 'api_keys';

export enum Permission {
  GENERAL = 'GENERAL',
}

export default interface ApiKey {
  _id: Types.ObjectId;
  key: string;
  version: number;
  permissions: Permission[];
  comments: string[];
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<ApiKey>(
  {
    key: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      maxlength: 1024,
      trim: true,
    },
    version: {
      type: Schema.Types.Number,
      required: true,
      min: 1,
      max: 100,
    },
    permissions: {
      type: [
        {
          type: Schema.Types.String,
          required: true,
          enum: Object.values(Permission),
        },
      ],
      required: true,
    },
    comments: {
      type: [
        {
          type: Schema.Types.String,
          required: true,
          trim: true,
          maxlength: 1000,
        },
      ],
      required: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index({ key: 1, status: 1 });

export const ApiKeyModel = model<ApiKey>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
