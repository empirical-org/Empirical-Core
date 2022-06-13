import {letters} from './letters'

export function edits(word): string[] {
  let i, results: string[] = [];
  // deletion
  for (i=0; i < word.length; i+=1)
    results.push(word.slice(0, i) + word.slice(i+1));
  // transposition
  for (i=0; i < word.length-1; i+=1)
    results.push(word.slice(0, i) + word.slice(i+1, i+2) + word.slice(i, i+1) + word.slice(i+2));
  // alteration
  for (i=0; i < word.length; i+=1)
    letters.forEach(function (l) {
      results.push(word.slice(0, i) + l + word.slice(i+1));
    });
  // insertion
  for (i=0; i <= word.length; i+=1)
    letters.forEach(function (l) {
      results.push(word.slice(0, i) + l + word.slice(i));
    });
  return results;
}