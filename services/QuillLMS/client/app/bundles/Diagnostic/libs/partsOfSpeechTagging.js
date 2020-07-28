// import pos from 'pos';
import _ from 'underscore';

export function getPartsOfSpeech (input) {
  try {
    // const words = new pos.Lexer().lex(input);
    // const tagger = new pos.Tagger();
    // return tagger.tag(words);
    return null
  }
  catch (e) {
    return undefined
  }
}

export function getPartsOfSpeechTags(input){
  var wordsTags = getPartsOfSpeech(input);
  if (wordsTags) {
    return wordsTags.map((b) => {
      return b[1]
    })
  }

}

export function getPartsOfSpeechWords(input){
  var wordsTags = getPartsOfSpeech(input);
  if (wordsTags) {
    return wordsTags.map((b) => {
      return b[0]
    })
  }
}

export function getPartsOfSpeechWordsWithTags(input){
  var wordsTags = getPartsOfSpeech(input);
  if (wordsTags) {
    return wordsTags.map((b) => {
      return [b[0], b[1]]
    })
  }
}

export function checkPOSEquivalancy (input, target) {
  const inputTags = getPartsOfSpeechTags(input)
  const targetTags = getPartsOfSpeechTags(target)
  return _.isEqual(inputTags,targetTags)
}

export function getPOSTagPairs (input, target) {
  const inputTags = getPartsOfSpeechTags(input)
  const targetTags = getPartsOfSpeechTags(target)
  return _.zip(inputTags, targetTags)
}

export function getPOSTransformations(input,target){
  var arraytagger = getPOSTagPairs(input,target);
  var arrayDifference = arraytagger.filter((b)=>{
    return b[0] != b[1];
  });
  return arrayDifference.map((b)=> {
    return b[0]+"|"+b[1];
  })
}
