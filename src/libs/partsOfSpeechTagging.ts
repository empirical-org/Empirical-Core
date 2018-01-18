import * as pos from 'pos';
import * as _ from 'underscore';

export function getPartsOfSpeech(input:string) {
  try {
    const words = new pos.Lexer().lex(input);
    const tagger = new pos.Tagger();
    return tagger.tag(words);
  }
  catch (e) {
    return undefined
  }
}

export function getPartsOfSpeechTags(input:string){
  var wordsTags = getPartsOfSpeech(input);
  if (wordsTags) {
    return wordsTags.map((b) => {
      return b[1]
    })
  }

}

export function getPartsOfSpeechWords(input:string){
  var wordsTags = getPartsOfSpeech(input);
  if (wordsTags) {
    return wordsTags.map((b) => {
      return b[0]
    })
  }
}

export function getPartsOfSpeechWordsWithTags(input:string){
  var wordsTags = getPartsOfSpeech(input);
  if (wordsTags) {
    return wordsTags.map((b) => {
      return [b[0], b[1]]
    })
  }
}

export function checkPOSEquivalancy (input:string, target:string) {
  const inputTags = getPartsOfSpeechTags(input)
  const targetTags = getPartsOfSpeechTags(target)
  console.log(input, target, inputTags, targetTags)
  return _.isEqual(inputTags,targetTags)
}

export function getPOSTagPairs (input:string, target:string) {
  const inputTags = getPartsOfSpeechTags(input)
  const targetTags = getPartsOfSpeechTags(target)
  return _.zip(inputTags, targetTags)
}

export function getPOSTransformations(input:string,target:string){
  var arraytagger = getPOSTagPairs(input,target);
  var arrayDifference = arraytagger.filter((b)=>{
    return b[0] != b[1];
  });
  return arrayDifference.map((b)=> {
    return b[0]+"|"+b[1];
  })
}
