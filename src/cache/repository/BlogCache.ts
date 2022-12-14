import { getJson, setJson } from '../query';
import { Types } from 'mongoose';
import Blog from '../../database/model/Blog';
import { DynamicKey, getDynamicKey } from '../keys';

function getKey(blogId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.BLOG, blogId.toHexString());
}

async function save(blog: Blog, expireAt: Date) {
  return setJson(getKey(blog._id), { ...blog }, expireAt);
}

async function fetch(blogId: Types.ObjectId) {
  return getJson<Blog>(getKey(blogId));
}

export default {
  save,
  fetch,
};
