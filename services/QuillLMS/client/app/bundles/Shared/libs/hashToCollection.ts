import * as _ from 'lodash';

interface HashWithKey {
  key?: string;
  [key:string]: any;
}

export function embedKeys(hash: object) {
  return _.mapValues(hash, (val: HashWithKey, key) => {
    if (val) {
      val.key = key;
      return val;
    }
  });
}

export function hashToCollection(hash: object):Array<any> {
  const wEmbeddedKeys = embedKeys(hash);
  const array = _.values(wEmbeddedKeys);
  return _.compact(array)
}
