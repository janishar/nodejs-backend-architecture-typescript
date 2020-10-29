// all dependent mock should be on the top
import { USER_ID, ACCESS_TOKEN } from '../authentication/mock';

import { Types } from 'mongoose';
import User from '../../../src/database/model/User';
import Role, { RoleCode } from '../../../src/database/model/Role';
import { BadTokenError } from '../../../src/core/ApiError';
import JWT, { JwtPayload } from '../../../src/core/JWT';
import { tokenInfo } from '../../../src/config';

export const LEARNER_ROLE_ID = new Types.ObjectId(); // random id
export const WRITER_ROLE_ID = new Types.ObjectId(); // random id
export const EDITOR_ROLE_ID = new Types.ObjectId(); // random id

export const USER_ID_WRITER = new Types.ObjectId(); // random id
export const USER_ID_EDITOR = new Types.ObjectId(); // random id

export const WRITER_ACCESS_TOKEN = 'def';
export const EDITOR_ACCESS_TOKEN = 'ghi';

export const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
  if (USER_ID.equals(id))
    return {
      _id: USER_ID,
      roles: [{ _id: LEARNER_ROLE_ID, code: RoleCode.LEARNER } as Role],
    } as User;
  if (USER_ID_WRITER.equals(id))
    return {
      _id: USER_ID_WRITER,
      roles: [
        { _id: LEARNER_ROLE_ID, code: RoleCode.LEARNER } as Role,
        { _id: WRITER_ROLE_ID, code: RoleCode.WRITER } as Role,
      ],
    } as User;
  if (USER_ID_EDITOR.equals(id))
    return {
      _id: USER_ID_EDITOR,
      roles: [
        { _id: LEARNER_ROLE_ID, code: RoleCode.LEARNER } as Role,
        { _id: WRITER_ROLE_ID, code: RoleCode.EDITOR } as Role,
      ],
    } as User;
  else return null;
});

export const mockRoleRepoFindByCode = jest.fn(
  async (code: string): Promise<Role | null> => {
    switch (code) {
      case RoleCode.WRITER:
        return {
          _id: WRITER_ROLE_ID,
          code: RoleCode.WRITER,
          status: true,
        } as Role;
      case RoleCode.EDITOR:
        return {
          _id: EDITOR_ROLE_ID,
          code: RoleCode.EDITOR,
          status: true,
        } as Role;
      case RoleCode.LEARNER:
        return {
          _id: LEARNER_ROLE_ID,
          code: RoleCode.LEARNER,
          status: true,
        } as Role;
    }
    return null;
  },
);

export const mockJwtValidate = jest.fn(
  async (token: string): Promise<JwtPayload> => {
    let subject = null;
    switch (token) {
      case ACCESS_TOKEN:
        subject = USER_ID.toHexString();
        break;
      case WRITER_ACCESS_TOKEN:
        subject = USER_ID_WRITER.toHexString();
        break;
      case EDITOR_ACCESS_TOKEN:
        subject = USER_ID_EDITOR.toHexString();
        break;
    }
    if (subject)
      return {
        iss: tokenInfo.issuer,
        aud: tokenInfo.audience,
        sub: subject,
        iat: 1,
        exp: 2,
        prm: 'abcdef',
      } as JwtPayload;
    throw new BadTokenError();
  },
);

jest.mock('../../../src/database/repository/UserRepo', () => ({
  get findById() {
    return mockUserFindById;
  },
}));

jest.mock('../../../src/database/repository/RoleRepo', () => ({
  get findByCode() {
    return mockRoleRepoFindByCode;
  },
}));

JWT.validate = mockJwtValidate;
