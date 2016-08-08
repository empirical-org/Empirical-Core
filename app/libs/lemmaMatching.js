import _ from 'underscore';
import pos from 'pos';
import natural from 'natural'

export function test(input) {
  var wordnet = new natural.WordNet();
  var temp = wordnet.lookupAsync(input)
  console.log(temp)
  return temp
}
