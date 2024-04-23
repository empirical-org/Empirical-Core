import {Dictionary} from './dictionary';
import {correct} from './correct';

const specialChars = ['.', ',', '!', '?', '"']
/**
 *
 * @param dictionary
 * @param sentence
 */
export function correctSentence(dictionary: Dictionary, sentence: string): string {
  const words = splitSentence(sentence);
  const correctedWords: string[] = words.map((word) => {
    return correctWord(dictionary, word);
  });
  return correctedWords.join(' ');
}

function splitSentence(sentence: string): string[] {
  return sentence.split(' ');
};

function correctWord(dictionary: Dictionary, word: string): string {
  const [start, middle, end] = removeSpecialCharsFromWord(word);
  return [start, correct(dictionary, middle), end].join('');
}

export function removeSpecialCharsFromStart(word: string): string[] {
  let index = 0;
  while (specialChars.indexOf(word[index]) !== -1) {
    index += 1;
  }
  return [word.substring(index), word.substring(0, index)];
}

export function removeSpecialCharsFromEnd(word: string): string[] {
  let index = word.length - 1;
  while (specialChars.indexOf(word[index]) !== -1) {
    index -= 1;
  }
  return [word.substring(0, index + 1), word.substring(index + 1)];
}

export function removeSpecialCharsFromWord(word: string): string[] {
  const [remainder, start] = removeSpecialCharsFromStart(word);
  const [middle, end] = removeSpecialCharsFromEnd(remainder);
  return [start, middle, end];
}