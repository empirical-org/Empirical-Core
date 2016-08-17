import pos from 'pos';
import _ from 'underscore';
import rootRef from "../../app/libs/firebase";
var	questionsRef = rootRef.child("questions");

export function getPartsOfSpeech (input) {
  const words = new pos.Lexer().lex(input);
  const tagger = new pos.Tagger();
  return tagger.tag(words);
}

export function getPartsOfSpeechTags(input){
  var wordsTags = getPartsOfSpeech(input);
  return wordsTags.map((b) => {
    return b[1]
  })
}

export function checkPOSEquivalancy (input, target) {
  const inputTags = getPartsOfSpeechTags(input)
  const targetTags = getPartsOfSpeechTags(target)
  console.log("\ninput: ", inputTags)
  console.log("\ntarget: ", targetTags)
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

export function inputReader(qid){
  var generated;
  questionsRef.child(qid).on('value',function(data){
    var questionData = data.val();
    var responseKeys = _.keys(responses);
    var target = questionData.prefilledText;
    var input = responses[responseKeys[2]].text;
    generated = qpos.getPOSTransformations(input,target);
  })
  return generated;
}

export function mostCommonErrors(qid) {
  questionsRef.child(qid).on("value", function(data) {
    const questionData = data.val()
    const responses = questionData.responses;
    const responseKeys = _.keys(responses)
    const target = "Bill swept the floor while Andy painted the walls."
    var errorHolder = {};
    responseKeys.forEach((key)=>{
      getPOSTransformations(responses[key].text,target).forEach((diffString)=> {
          if (errorHolder[diffString]){
            errorHolder[diffString] += responses[key].count;
          } else {
            errorHolder[diffString] = responses[key].count;
          }
        })
     })
     const sortedKeys = Object.keys(errorHolder).sort(function(a,b){
       return errorHolder[b]-errorHolder[a];
     })
     sortedKeys.forEach((key) => {
       console.log("\t" + key + ": \t" + errorHolder[key])
     })
  })
}
