import * as _ from 'lodash';

export function embedKeys(hash) {
  return _.mapValues(hash, (val, key) => {
    val.key = key;
    return val;
  });
}

export function hashToCollection(hash) {
  const wEmbeddedKeys = embedKeys(hash);
  return _.values(wEmbeddedKeys);
}
