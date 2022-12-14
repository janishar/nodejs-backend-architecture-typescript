import { getListRange, setList } from '../query';
import Blog from '../../database/model/Blog';
import { DynamicKey, getDynamicKey } from '../keys';
import { addMillisToCurrentDate } from '../../helpers/utils';
import { caching } from '../../config';
import { Types } from 'mongoose';

function getKeyForSimilar(blogId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.BLOGS_SIMILAR, blogId.toHexString());
}

async function saveSimilarBlogs(blogId: Types.ObjectId, blogs: Blog[]) {
  return setList(
    getKeyForSimilar(blogId),
    blogs,
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchSimilarBlogs(blogId: Types.ObjectId) {
  return getListRange<Blog>(getKeyForSimilar(blogId));
}

export default {
  saveSimilarBlogs,
  fetchSimilarBlogs,
};
