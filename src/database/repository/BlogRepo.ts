import Blog, { IBlog } from '../model/Blog';
import { Types } from 'mongoose';
import { IUser } from '../model/User';

export default class BlogRepository {

	private static AUTHOR_DETAIL = 'name profilePicUrl';
	private static BLOG_INFO_ADDITIONAL = '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
	private static BLOG_DETAILS = '+draftText +draftEditorState +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';
	private static BLOG_ALL_DATA = '+text +draftText +editorState +draftEditorState +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';

	public static async create(blog: IBlog): Promise<IBlog> {
		const now = new Date();
		blog.createdAt = now;
		blog.updatedAt = now;
		const createdBlog = await Blog.create(blog);
		return createdBlog.toObject();
	}

	public static update(blog: IBlog): Promise<any> {
		blog.updatedAt = new Date();
		return Blog.updateOne({ _id: blog._id }, { $set: { ...blog } }).lean<IBlog>().exec();
	}

	public static findDetailsById(id: Types.ObjectId): Promise<IBlog> {
		return Blog.findOne({ _id: id, status: true })
			.select(this.BLOG_DETAILS)
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findInfoById(id: Types.ObjectId): Promise<IBlog> {
		return Blog.findOne({ _id: id, status: true })
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findInfoWithTextById(id: Types.ObjectId): Promise<IBlog> {
		return Blog.findOne({ _id: id, status: true })
			.select('+text')
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findInfoWithTextAndDraftTextById(id: Types.ObjectId): Promise<IBlog> {
		return Blog.findOne({ _id: id, status: true })
			.select('+text +draftText +isSubmitted +isDraft +isPublished +status')
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findBlogAllDataById(id: Types.ObjectId): Promise<IBlog> {
		return Blog.findOne({ _id: id, status: true })
			.select(this.BLOG_ALL_DATA)
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findAllDrafts(): Promise<IBlog[]> {
		return Blog.find({ isDraft: true, status: true })
			.select(this.BLOG_INFO_ADDITIONAL)
			.sort({ updatedAt: -1 })
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findAllSubmissions(): Promise<IBlog[]> {
		return Blog.find({ isSubmitted: true, status: true })
			.select(this.BLOG_INFO_ADDITIONAL)
			.sort({ updatedAt: -1 })
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findAllPublished(): Promise<IBlog[]> {
		return Blog.find({ isPublished: true, status: true })
			.select(this.BLOG_INFO_ADDITIONAL)
			.sort({ updatedAt: -1 })
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findByUrl(blogUrl: string): Promise<IBlog> {
		return Blog.findOne({ blogUrl: blogUrl, status: true })
			.select('+text')
			.populate('author', this.AUTHOR_DETAIL)
			.lean<IBlog>()
			.exec();
	}

	public static findByTagAndPaginated(tag: string, pageNumber: number, limit: number): Promise<IBlog[]> {
		return Blog.find({ tag: tag, status: true, isPublished: true })
			.skip(limit * (pageNumber - 1))
			.limit(limit)
			.populate('author', this.AUTHOR_DETAIL)
			.sort({ updatedAt: -1 })
			.lean<IBlog>()
			.exec();
	}

	public static findAllPublishedForAuthor(user: IUser): Promise<IBlog[]> {
		return Blog.find({ author: user, status: true, isPublished: true })
			.populate('author', this.AUTHOR_DETAIL)
			.sort({ updatedAt: -1 })
			.lean<IBlog>()
			.exec();
	}

	public static findLatestBlogs(pageNumber: number, limit: number): Promise<IBlog[]> {
		return Blog.find({ status: true, isPublished: true })
			.skip(limit * (pageNumber - 1))
			.limit(limit)
			.populate('author', this.AUTHOR_DETAIL)
			.sort({ publishedAt: -1 })
			.lean<IBlog>()
			.exec();
	}

	public static searchSimilarBlogs(blog: IBlog, limit: number)
		: Promise<IBlog[]> {
		return Blog.find(
			{
				$text: { $search: blog.title, $caseSensitive: false },
				status: true,
				isPublished: true,
				_id: { $ne: blog._id }
			},
			{
				similarity: { $meta: 'textScore' }
			})
			.populate('author', this.AUTHOR_DETAIL)
			.sort({ updatedAt: -1 })
			.limit(limit)
			.sort({ similarity: { $meta: 'textScore' } })
			.lean<IBlog>()
			.exec();
	}

	public static search(query: string, limit: number): Promise<IBlog[]> {
		return Blog.find(
			{
				$text: { $search: query, $caseSensitive: false },
				status: true,
				isPublished: true,
			},
			{
				similarity: { $meta: 'textScore' }
			})
			.select('-status -description')
			.limit(limit)
			.sort({ similarity: { $meta: 'textScore' } })
			.lean<IBlog>()
			.exec();
	}

	public static searchLike(query: string, limit: number): Promise<IBlog[]> {
		return Blog.find(
			{
				title: { $regex: `.*${query}.*`, $options: 'i' },
				status: true,
				isPublished: true,
			})
			.select('-status -description')
			.limit(limit)
			.sort({ score: -1 })
			.lean<IBlog>()
			.exec();
	}
}