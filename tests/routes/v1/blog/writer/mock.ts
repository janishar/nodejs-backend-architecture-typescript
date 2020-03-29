import { IBlog } from '../../../../../src/database/model/Blog';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/BlogRepo');

export const BLOG_ID = new Types.ObjectId();
export const BLOG_URL = 'abc';

export const mockBlogFindUrlIfExists = jest.fn(async (blogUrl: string): Promise<IBlog> => {
	if (blogUrl === BLOG_URL) return <IBlog>{
		_id: BLOG_ID,
		blogUrl: blogUrl
	};
	return null;
});

export const mockBlogCreate = jest.fn(async (blog: IBlog): Promise<IBlog> => {
	blog._id = BLOG_ID;
	return blog;
});

jest.mock('../../../../../src/database/repository/BlogRepo', () => ({
	get findUrlIfExists() { return mockBlogFindUrlIfExists; },
	get create() { return mockBlogCreate; }
}));