import ApiKey from '../../../src/database/model/ApiKey';

export const API_KEY = 'abc';

export const mockFindApiKey = jest.fn(async (key: string) => {
  if (key == API_KEY)
    return {
      key: API_KEY,
      permissions: ['GENERAL'],
    } as ApiKey;
  else return null;
});

jest.mock('../../../src/database/repository/ApiKeyRepo', () => ({
  findByKey: mockFindApiKey,
}));
