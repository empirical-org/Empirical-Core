var data = require('./data.js')
var _ = require('lodash');
var pos = require('pos');

function getPartsOfSpeech (input) {
  const words = new pos.Lexer().lex(input);
  const tagger = new pos.Tagger();
  return tagger.tag(words);
}

function getPartsOfSpeechTags(input){
  var wordsTags = getPartsOfSpeech(input);
  return wordsTags.map((b) => {
    return b[1]
  })
}

var output = _.map(data, function(obj) {
  obj.pos = getPartsOfSpeechTags(obj.text)
  return obj
});

console.log(output)
