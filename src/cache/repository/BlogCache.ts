import { getJson, setJson } from '../query';
import { Types } from 'mongoose';
import Blog from '../../database/model/Blog';
import { DynamicKey, getDynamicKey } from '../keys';
import { caching } from '../../config';
import { addMillisToCurrentDate } from '../../helpers/utils';

function getKeyForId(blogId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.BLOG, blogId.toHexString());
}

function getKeyForUrl(blogUrl: string) {
  return getDynamicKey(DynamicKey.BLOG, blogUrl);
}

async function save(blog: Blog) {
  return setJson(
    getKeyForId(blog._id),
    { ...blog },
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchById(blogId: Types.ObjectId) {
  return getJson<Blog>(getKeyForId(blogId));
}

async function fetchByUrl(blogUrl: string) {
  return getJson<Blog>(getKeyForUrl(blogUrl));
}

export default {
  save,
  fetchById,
  fetchByUrl,
};
