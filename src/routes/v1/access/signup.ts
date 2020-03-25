import express, { Request, Response, NextFunction } from 'express';
import { RoleRequest } from 'app-request';
import { SuccessResponse } from '../../../utils/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError } from '../../../utils/ApiError';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import { IUser } from '../../database/common/models/User';
import { Tokens } from 'app-request';
import { createTokens } from './auth/AuthUtils';
import Log from '../../utils/Log';
import { IKeystore } from '../../database/common/models/Keystore';

const config = require('../../../config');

const router = express.Router();

router.post('/mindorks',
	(req: RoleRequest, res: Response, next: NextFunction) => {
		new ValidationBuilder()
			.emptyFieldValidation(req.body.name, 'Name')
			.emailFieldValidation(req.body.email, 'Email')
			.emptyFieldValidation(req.body.password, 'Password')
			.build()
			.validate()
			.then(() => {
				if (req.body.password.toString().length < 6)
					return new BadRequestResponse('Password should atleast contain 6 characters').send(res)
				next()
			})
			.catch(err => new BadRequestResponse(err).send(res));
	},
	(req: RoleRequest, res: Response, next: NextFunction) => {
		let registeredUser: IUser;
		UserRepo.findUserByEmail(req.body.email)
			.then(user => {
				if (user !== undefined && user !== null) throw new BadRequestError('User already registered');

				const accessTokenKey = crypto.randomBytes(64).toString('hex');
				const refreshTokenKey = crypto.randomBytes(64).toString('hex');
				const encryptedPwd = Utils.getEncryptedPassword(req.body.password, config.SALT);

				return UserRepo.create(<IUser>{
					name: req.body.name,
					email: req.body.email,
					password: encryptedPwd,
				}, accessTokenKey, refreshTokenKey, req.CURRENT_ROLE_CODE)
			})
			.then(({ user, keystore }: { user: IUser, keystore: IKeystore }) => {
				Log.d("ALI HERE 2", user, keystore)
				registeredUser = user;
				return createTokens(registeredUser, keystore.primaryKey, keystore.secondaryKey);
			})
			.then((tokens: Tokens) => new LoginResponse(
				"Signup Successful",
				registeredUser,
				tokens.accessToken,
				tokens.refreshToken,
				registeredUser.roles
			).send(res))
			.catch(err => {
				Log.d(err)
				next(err)
			})
	})

module.exports = router;