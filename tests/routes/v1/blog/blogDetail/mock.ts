import Blog from '../../../../../src/database/model/Blog';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/BlogRepo');

export const BLOG_ID = new Types.ObjectId();
export const BLOG_URL = 'abc';

export const mockBlogFindByUrl = jest.fn(
  async (blogUrl: string): Promise<Blog | null> => {
    if (blogUrl === BLOG_URL)
      return {
        _id: BLOG_ID,
        blogUrl: blogUrl,
      } as Blog;
    return null;
  },
);

export const mockFindInfoWithTextById = jest.fn(
  async (id: Types.ObjectId): Promise<Blog | null> => {
    if (BLOG_ID.equals(id))
      return {
        _id: BLOG_ID,
        blogUrl: BLOG_URL,
      } as Blog;
    return null;
  },
);

jest.mock('../../../../../src/database/repository/BlogRepo', () => ({
  get findByUrl() {
    return mockBlogFindByUrl;
  },
  get findInfoWithTextById() {
    return mockFindInfoWithTextById;
  },
}));
