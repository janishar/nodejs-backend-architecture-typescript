import { addHeaders } from '../../../../auth/authentication/mock';

import { mockBlogFindByUrl, mockFindInfoWithTextById, BLOG_ID, BLOG_URL } from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('BlogDetail by URL route', () => {
  beforeEach(() => {
    mockBlogFindByUrl.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/blog/url';

  it('Should send error when endpoint query is not passed', async () => {
    const response = await addHeaders(request.get(endpoint));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/endpoint/);
    expect(response.body.message).toMatch(/required/);
    expect(mockBlogFindByUrl).not.toBeCalled();
  });

  it('Should send error when url endpoint is more that 200 chars', async () => {
    const param = new Array(201).fill('a').join('');
    const response = await addHeaders(request.get(endpoint).query({ endpoint: param }));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/length must/);
    expect(response.body.message).toMatch(/200/);
    expect(mockBlogFindByUrl).not.toBeCalled();
  });

  it('Should send error when blog do not exists for url', async () => {
    const response = await addHeaders(request.get(endpoint).query({ endpoint: 'xyz' }));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/do not exists/);
    expect(mockBlogFindByUrl).toBeCalledTimes(1);
    expect(mockBlogFindByUrl).toBeCalledWith('xyz');
  });

  it('Should send data when blog exists for url', async () => {
    const response = await addHeaders(request.get(endpoint).query({ endpoint: BLOG_URL }));
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('_id');
    expect(mockBlogFindByUrl).toBeCalledTimes(1);
    expect(mockBlogFindByUrl).toBeCalledWith(BLOG_URL);
  });
});

describe('BlogDetail by id route', () => {
  beforeEach(() => {
    mockFindInfoWithTextById.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/blog/id/';

  it('Should send error when invalid id is passed', async () => {
    const response = await addHeaders(request.get(endpoint + 'abc'));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/);
    expect(mockFindInfoWithTextById).not.toBeCalled();
  });

  it('Should send error when blog do not exists for id', async () => {
    const response = await addHeaders(request.get(endpoint + new Types.ObjectId().toHexString()));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/do not exists/);
    expect(mockFindInfoWithTextById).toBeCalledTimes(1);
  });

  it('Should send data when blog exists for id', async () => {
    const response = await addHeaders(request.get(endpoint + BLOG_ID.toHexString()));
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('_id');
    expect(mockFindInfoWithTextById).toBeCalledTimes(1);
  });
});
