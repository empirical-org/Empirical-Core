import {Dictionary} from './dictionary';
import {edits} from './edits'
import {max} from './max';
import {countKeys} from './countKeys'

export function correct(dictionary: Dictionary, potentialWord: string): string {
  if (dictionary.hasOwnProperty(potentialWord.toLowerCase()) || dictionary.hasOwnProperty(potentialWord)) {
    return potentialWord
  }
  const candidates = {}
  const list = edits(potentialWord);
  list.forEach(function (edit) {
    if (dictionary.hasOwnProperty(edit)) candidates[dictionary[edit]] = edit;
  });
  if (countKeys(candidates) > 0) return candidates[max(candidates)];

  list.forEach(function (edit) {
    edits(edit).forEach(function (w) {
      if (dictionary.hasOwnProperty(w)) candidates[dictionary[w]] = w;
    });
  });
  return countKeys(candidates) > 0 ? candidates[max(candidates)] : potentialWord;
}