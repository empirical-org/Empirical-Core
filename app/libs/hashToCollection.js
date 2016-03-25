import _ from 'lodash'

export function embedKeys (hash) {
  return _.mapValues(hash, (val, key) => {
    val.key = key;
    return val
  })
}

export function hashToCollection (hash) {
  var wEmbeddedKeys = embedKeys(hash)
  console.log(_.values(wEmbeddedKeys));
  return _.values(wEmbeddedKeys)
}
