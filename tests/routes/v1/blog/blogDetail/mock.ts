import { IBlog } from '../../../../../src/database/model/Blog';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/BlogRepo');

export const BLOG_ID = new Types.ObjectId();
export const BLOG_URL = 'abc';

export const mockBlogFindByUrl = jest.fn(async (blogUrl: string): Promise<IBlog> => {
	if (blogUrl === BLOG_URL) return <IBlog>{
		_id: BLOG_ID,
		blogUrl: blogUrl
	};
	return null;
});

export const mockFindInfoWithTextById = jest.fn(async (id: Types.ObjectId): Promise<IBlog> => {
	if (BLOG_ID.equals(id)) return <IBlog>{
		_id: BLOG_ID,
		blogUrl: BLOG_URL
	};
	return null;
});

jest.mock('../../../../../src/database/repository/BlogRepo', () => ({
	get findByUrl() { return mockBlogFindByUrl; },
	get findInfoWithTextById() { return mockFindInfoWithTextById; }
}));