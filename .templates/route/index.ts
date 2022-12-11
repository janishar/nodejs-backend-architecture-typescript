/*
import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import { BadRequestError } from '../../../core/ApiError';
import role from '../../../helpers/role';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.LEARNER), authorization);
//----------------------------------------------------------------

router.post(
  '/sample',
  validator(schema.sample, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    new SuccessResponse('Success', {}).send(res);
  }),
);

export default router;
*/
