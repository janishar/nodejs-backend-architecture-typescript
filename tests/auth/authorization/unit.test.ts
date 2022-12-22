import '../../database/mock';
import '../../cache/mock';
import { addAuthHeaders } from '../authentication/mock';

// import the mock for the current test after all other mock imports
// this will prevent the different implementations for same function by the other mocks
import {
  mockRoleRepoFindByCodes,
  mockUserFindById,
  EDITOR_ACCESS_TOKEN,
} from './mock';

import app from '../../../src/app';
import supertest from 'supertest';
import { RoleCode } from '../../../src/database/model/Role';

describe('authentication validation for editor', () => {
  const endpoint = '/blog/editor/test';
  const request = supertest(app);

  beforeEach(() => {
    mockRoleRepoFindByCodes.mockClear();
    mockUserFindById.mockClear();
  });

  it('Should response with 401 if user do not have editor role', async () => {
    const response = await addAuthHeaders(request.get(endpoint));
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/denied/);
    expect(mockRoleRepoFindByCodes).toBeCalledTimes(1);
    expect(mockUserFindById).toBeCalledTimes(1);
    expect(mockRoleRepoFindByCodes).toBeCalledWith([
      RoleCode.ADMIN,
      RoleCode.EDITOR,
    ]);
  });
});

describe('authentication validation for writer', () => {
  const endpoint = '/blog/writer/test';
  const request = supertest(app);

  beforeEach(() => {
    mockRoleRepoFindByCodes.mockClear();
    mockUserFindById.mockClear();
  });

  it('Should response with 404 if user have writer role', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint),
      EDITOR_ACCESS_TOKEN,
    );
    expect(response.status).toBe(404);
    expect(mockRoleRepoFindByCodes).toBeCalledTimes(1);
    expect(mockUserFindById).toBeCalledTimes(1);
    expect(mockRoleRepoFindByCodes).toBeCalledWith([RoleCode.WRITER]);
  });
});
