import {Dictionary} from './dictionary';

// declare function train(text: string): Dictionary;
export function train(text: string, existingDictionary?: Dictionary): Dictionary {
  if (typeof(text) !== 'string') {
    return {}
  }
  const dictionary: Dictionary = existingDictionary ? Object.assign({}, existingDictionary) : {};
  let word, m;
  const r = /[a-z]+/gi;
  text = text;
  while (m = r.exec(text)) {
    word = m[0];
    dictionary[word] = dictionary.hasOwnProperty(word) ? dictionary[word] + 1 : 1;
  }
  return dictionary;
}