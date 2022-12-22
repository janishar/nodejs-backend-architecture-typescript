import '../../../database/mock';
import '../../../cache/mock';
import { addAuthHeaders } from '../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { WRITER_ACCESS_TOKEN } from '../../../auth/authorization/mock';

import {
  BLOG_ID,
  BLOG_URL,
  BLOG_ID_2,
  mockBlogCreate,
  mockBlogFindUrlIfExists,
  mockFindBlogAllDataById,
  mockBlogUpdate,
} from './mock';

import supertest from 'supertest';
import app from '../../../../src/app';
import { Types } from 'mongoose';

describe('Writer blog create routes', () => {
  beforeEach(() => {
    mockBlogCreate.mockClear();
    mockBlogFindUrlIfExists.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/blog/writer';

  it('Should send error if the user do have writer role', async () => {
    const response = await addAuthHeaders(request.post(endpoint));
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/permission denied/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog title not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        description: 'description',
        text: 'text',
        blogUrl: 'blogUrl',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/title/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog description not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        text: 'text',
        blogUrl: 'blogUrl',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/description/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog text not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        blogUrl: 'blogUrl',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/text/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog blogUrl not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/blogUrl/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog blogUrl is not in accepted format', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        blogUrl: 'https://abc.com/xyz',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/blogUrl/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog imgUrl is not an url', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        blogUrl: 'blogUrl',
        imgUrl: 'abc',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/imgUrl/i);
    expect(response.body.message).toMatch(/valid uri/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog score is invalid', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        blogUrl: 'blogUrl',
        score: 'abc',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/must be a number/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog tags is invalid', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        blogUrl: 'blogUrl',
        tags: 'abc',
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/must be/i);
    expect(response.body.message).toMatch(/array/i);
    expect(mockBlogFindUrlIfExists).not.toBeCalled();
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send error if blog already exists for blogUrl', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        blogUrl: BLOG_URL,
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/already exists/i);
    expect(mockBlogFindUrlIfExists).toBeCalledTimes(1);
    expect(mockBlogCreate).not.toBeCalled();
  });

  it('Should send success if blog data is correct', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description',
        text: 'text',
        blogUrl: 'blogUrl',
        imgUrl: 'https://abc.com/xyz',
        score: 0.01,
        tags: ['ABC'],
      }),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/created success/i);
    expect(mockBlogFindUrlIfExists).toBeCalledTimes(1);
    expect(mockBlogCreate).toBeCalledTimes(1);
    expect(response.body.data).toMatchObject({ _id: BLOG_ID.toHexString() });
  });
});

describe('Writer blog submit routes', () => {
  beforeEach(() => {
    mockFindBlogAllDataById.mockClear();
    mockBlogUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/blog/writer/submit/';

  it('Should send error if submit blog id is not valid', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + 'abc'),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockFindBlogAllDataById).not.toBeCalled();
    expect(mockBlogUpdate).not.toBeCalled();
  });

  it('Should send error if submit blog do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + new Types.ObjectId().toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
    expect(mockBlogUpdate).not.toBeCalled();
  });

  it('Should send success if submit blog for id exists', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + BLOG_ID.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/submitted success/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
    expect(mockBlogUpdate).toBeCalledTimes(1);
  });
});

describe('Writer blog withdraw routes', () => {
  beforeEach(() => {
    mockFindBlogAllDataById.mockClear();
    mockBlogUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/blog/writer/withdraw/';

  it('Should send error if withdraw blog id is not valid', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + 'abc'),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockFindBlogAllDataById).not.toBeCalled();
    expect(mockBlogUpdate).not.toBeCalled();
  });

  it('Should send error if withdraw blog do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + new Types.ObjectId().toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
    expect(mockBlogUpdate).not.toBeCalled();
  });

  it('Should send success if withdraw blog for id exists', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + BLOG_ID.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/withdrawn success/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
    expect(mockBlogUpdate).toBeCalledTimes(1);
  });
});

describe('Writer blog delete routes', () => {
  beforeEach(() => {
    mockFindBlogAllDataById.mockClear();
    mockBlogUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/blog/writer/id/';

  it('Should send error if deleting blog id is not valid', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint + 'abc'),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockFindBlogAllDataById).not.toBeCalled();
    expect(mockBlogUpdate).not.toBeCalled();
  });

  it('Should send error if deleting blog do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint + new Types.ObjectId().toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
    expect(mockBlogUpdate).not.toBeCalled();
  });

  it('Should send success if deleting blog for id exists', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint + BLOG_ID.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted success/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
    expect(mockBlogUpdate).toBeCalledTimes(1);
  });
});

describe('Writer blog get by id routes', () => {
  beforeEach(() => {
    mockFindBlogAllDataById.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/blog/writer/id/';

  it('Should send error if fetching blog id is not valid', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint + 'abc'),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockFindBlogAllDataById).not.toBeCalled();
  });

  it('Should send error if fetching blog do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint + new Types.ObjectId().toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
  });

  it('Should send error if author is different', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint + BLOG_ID_2.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/don't have/i);
    expect(response.body.message).toMatch(/permission/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
  });

  it('Should send success if fetching blog for id exists', async () => {
    const response = await addAuthHeaders(
      request.get(endpoint + BLOG_ID.toHexString()),
      WRITER_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/i);
    expect(mockFindBlogAllDataById).toBeCalledTimes(1);
    expect(response.body.data).toMatchObject({ _id: BLOG_ID.toHexString() });
  });
});
