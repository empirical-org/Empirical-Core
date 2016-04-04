import _ from 'lodash'

export function embedKeys (hash) {
  return _.mapValues(hash, (val, key) => {
    val.key = key;
    return val
  })
}

export function hashToCollection (hash) {
  var wEmbeddedKeys = embedKeys(hash)
  return _.values(wEmbeddedKeys)
}
