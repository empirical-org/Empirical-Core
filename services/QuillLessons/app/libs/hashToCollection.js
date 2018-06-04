import _ from 'lodash';

export function embedKeys(hash) {
  return _.mapValues(hash, (val, key) => {
    if (val) {
      val.key = key;
      return val;
    }
  });
}

export function hashToCollection(hash) {
  const wEmbeddedKeys = embedKeys(hash);
  const array = _.values(wEmbeddedKeys);
  return _.compact(array)
}
