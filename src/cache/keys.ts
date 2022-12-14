export enum Key {
  BLOGS_LATEST = 'BLOGS_LATEST',
}

export enum DynamicKey {
  BLOGS_TAG = 'BLOGS_TAG',
  BLOG = 'BLOG',
}

export type DynamicKeyType = `${DynamicKey}_${string}`;

export function getDynamicKey(key: DynamicKey, suffix: string) {
  const dynamic: DynamicKeyType = `${key}_${suffix}`;
  return dynamic;
}
