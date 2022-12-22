import '../../../database/mock';
import '../../../cache/mock';
import { addHeaders } from '../../../auth/authentication/mock';

import {
  mockBlogCacheFetchById,
  mockBlogCacheFetchByUrl,
  mockBlogCacheSave,
  mockPublishedBlogFindByUrl,
  mockPublishedBlogFindById,
  BLOG_ID,
  BLOG_URL,
  BLOG_2_URL,
  BLOG_2_ID,
} from './mock';

import supertest from 'supertest';
import app from '../../../../src/app';
import { Types } from 'mongoose';

describe('BlogDetail by URL route', () => {
  beforeEach(() => {
    mockBlogCacheFetchByUrl.mockClear();
    mockBlogCacheSave.mockClear();
    mockPublishedBlogFindByUrl.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/blog/url';

  it('Should send error when endpoint query is not passed', async () => {
    const response = await addHeaders(request.get(endpoint));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/endpoint/);
    expect(response.body.message).toMatch(/required/);
    expect(mockPublishedBlogFindByUrl).not.toBeCalled();
  });

  it('Should send error when url endpoint is more that 200 chars', async () => {
    const param = new Array(201).fill('a').join('');
    const response = await addHeaders(
      request.get(endpoint).query({ endpoint: param }),
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/length must/);
    expect(response.body.message).toMatch(/200/);
    expect(mockPublishedBlogFindByUrl).not.toBeCalled();
  });

  it('Should send error when blog do not exists for url', async () => {
    const response = await addHeaders(
      request.get(endpoint).query({ endpoint: 'xyz' }),
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/);
    expect(mockBlogCacheFetchByUrl).toBeCalledTimes(1);
    expect(mockBlogCacheFetchByUrl).toBeCalledWith('xyz');
    expect(mockBlogCacheSave).not.toBeCalled();
    expect(mockPublishedBlogFindByUrl).toBeCalledTimes(1);
    expect(mockPublishedBlogFindByUrl).toBeCalledWith('xyz');
  });

  it('Should send cache data when blog exists for url in cache', async () => {
    const response = await addHeaders(
      request.get(endpoint).query({ endpoint: BLOG_URL }),
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('_id');

    expect(mockBlogCacheFetchByUrl).toBeCalledTimes(1);
    expect(mockBlogCacheFetchByUrl).toBeCalledWith(BLOG_URL);
    expect(mockBlogCacheFetchByUrl).toReturnTimes(1);

    expect(mockPublishedBlogFindByUrl).not.toBeCalled();
    expect(mockBlogCacheSave).not.toBeCalled();
  });

  it('Should send database data when blog dont exists for url in cache', async () => {
    const response = await addHeaders(
      request.get(endpoint).query({ endpoint: BLOG_2_URL }),
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('_id');

    expect(mockBlogCacheFetchByUrl).toBeCalledTimes(1);
    expect(mockBlogCacheFetchByUrl).toBeCalledWith(BLOG_2_URL);
    expect(mockBlogCacheFetchByUrl).toReturnTimes(1);

    expect(mockPublishedBlogFindByUrl).toBeCalledTimes(1);
    expect(mockPublishedBlogFindByUrl).toBeCalledWith(BLOG_2_URL);
    expect(mockPublishedBlogFindByUrl).toReturnTimes(1);

    expect(mockBlogCacheSave).toBeCalledTimes(1);
    expect(mockBlogCacheSave).toReturnTimes(1);
  });
});

describe('BlogDetail by id route', () => {
  beforeEach(() => {
    mockBlogCacheFetchById.mockClear();
    mockBlogCacheSave.mockClear();
    mockPublishedBlogFindById.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/blog/id/';

  it('Should send error when invalid id is passed', async () => {
    const response = await addHeaders(request.get(endpoint + 'abc'));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/);
    expect(mockPublishedBlogFindById).not.toBeCalled();
  });

  it('Should send error when blog do not exists for id', async () => {
    const response = await addHeaders(
      request.get(endpoint + new Types.ObjectId().toHexString()),
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/);
    expect(mockPublishedBlogFindById).toBeCalledTimes(1);
  });

  it('Should send cache data when blog exists for id in cache', async () => {
    const response = await addHeaders(
      request.get(endpoint + BLOG_ID.toHexString()),
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('_id');

    expect(mockBlogCacheFetchById).toBeCalledTimes(1);
    expect(mockBlogCacheFetchById).toBeCalledWith(BLOG_ID);
    expect(mockBlogCacheFetchById).toReturnTimes(1);

    expect(mockPublishedBlogFindById).not.toBeCalled();
    expect(mockBlogCacheSave).not.toBeCalled();
  });

  it('Should send database data when blog dont exists for url in cache', async () => {
    const response = await addHeaders(
      request.get(endpoint + BLOG_2_ID.toHexString()),
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('_id');

    expect(mockBlogCacheFetchById).toBeCalledTimes(1);
    expect(mockBlogCacheFetchById).toBeCalledWith(BLOG_2_ID);
    expect(mockBlogCacheFetchById).toReturnTimes(1);

    expect(mockPublishedBlogFindById).toBeCalledTimes(1);
    expect(mockPublishedBlogFindById).toBeCalledWith(BLOG_2_ID);
    expect(mockPublishedBlogFindById).toReturnTimes(1);

    expect(mockBlogCacheSave).toBeCalledTimes(1);
    expect(mockBlogCacheSave).toReturnTimes(1);
  });
});
