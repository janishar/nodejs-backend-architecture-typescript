import { Request } from 'express';
import { IUser } from '../database/model/User';
import { IKeystore } from '../database/model/Keystore';

declare interface PublicRequest extends Request {
	apiKey: string;
}

declare interface RoleRequest extends PublicRequest {
	currentRoleCode: string;
}

declare interface ProtectedRequest extends RoleRequest {
	user: IUser;
	accessToken: string;
	keystore: IKeystore;
}

declare interface Tokens {
	accessToken: string,
	refreshToken: string,
}