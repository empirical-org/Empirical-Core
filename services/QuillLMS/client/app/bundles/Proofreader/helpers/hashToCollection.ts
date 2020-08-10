import _ from 'lodash';

export function embedKeys(hash: Object) {
  return _.mapValues(hash, (val, key) => {
    if (val) {
      val.key = key;
      return val;
    }
  });
}

export function hashToCollection(hash: Object) {
  const wEmbeddedKeys = embedKeys(hash);
  const array = _.values(wEmbeddedKeys);
  return _.compact(array)
}
