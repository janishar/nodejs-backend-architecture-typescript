import { getListRange, setList } from '../query';
import Blog from '../../database/model/Blog';
import { DynamicKey, getDynamicKey } from '../keys';

function getTagKey(tag: string) {
  return getDynamicKey(DynamicKey.BLOGS_TAG, tag);
}

async function saveForTag(tag: string, blogs: Blog[], expireAt: Date) {
  return setList(getTagKey(tag), blogs, expireAt);
}

async function fetch(tag: string) {
  return getListRange<Blog>(getTagKey(tag));
}

export default {
  saveForTag,
  fetch,
};
