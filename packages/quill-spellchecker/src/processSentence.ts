export function processSentence(sentence: string): string {
  if (sentence) {
    return sentence.replace(/[.\/#!\^&\*;:{}=_`~()]/g, '').replace(/,\s/g, '\n').replace(/\s/g, '\n');
  }
  return '';
}
