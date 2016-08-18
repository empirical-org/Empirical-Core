import expect from 'expect';
import pos from 'pos';
import * as qpos from '../../app/libs/partsOfSpeechTagging.js';
import * as responseData from "../responsesForPOSTesting.js";
import POSMatcher from '../../app/libs/sentenceFragment.js';
import _ from 'underscore';

describe("Converting a string to a list of parts of speech", () => {
  it("works with the library function", () => {
    const input = "Catherine";
    const words = new pos.Lexer().lex(input);
    const tagger = new pos.Tagger();
    const taggedWords = tagger.tag(words);
    expect(taggedWords).toEqual([['Catherine', 'NNP']]);
  })

  it("returns the same as the pos speech library when called from getPartsOfSpeech", () => {
    const input = "Catherine";
    const words = new pos.Lexer().lex(input);
    const tagger = new pos.Tagger();
    const expected = tagger.tag(words);
    const generated = qpos.getPartsOfSpeech(input);
    expect(expected).toEqual(generated);
  })

  it("Correctly identifies adverbs", () => {
    const input = "She ran quickly after the dog.";
    const generated = qpos.getPartsOfSpeech(input);
    const expected = ["quickly","RB"]
    expect(generated[2]).toEqual(expected);
  })

  it("can return an array of POS tags", () => {
    const input = "She ran quickly after the dog.";
    const generated = qpos.getPartsOfSpeechTags(input);
    const expected = ["PRP", "VBD", "RB", "IN", "DT", "NN", '.']
    expect(generated).toEqual(expected);
  })

  it("can compare two inputs and say id POS is the same",()=>{
    const input = "She ran quickly after the dog.";
    const target = "She ran quickly after the cat.";
    const generated = qpos.checkPOSEquivalancy(input,target);
    const expected = true;
    expect(generated).toEqual(expected);
  })

  it("can compare two inputs and say id POS is the different",()=>{
    const input = "She ran quickly after the dog.";
    const target = "She ran quickly after the cats.";
    const generated = qpos.checkPOSEquivalancy(input,target);
    const expected = false;
    expect(generated).toEqual(expected);
  })

  it("get a list of type list list with POS for two inputs", () => {
    const input = "She ran after the dog.";
    const target = "She ran after the dogs.";
    const generated = qpos.getPOSTagPairs(input,target);
    const expected = [['PRP','PRP'],['VBD','VBD'],['IN','IN'],['DT','DT'],['NN','NNS'],['.','.']];
    expect(generated).toEqual(expected);
  })

  // console.log(qpos.getPartsOfSpeech("while"))

  it("returns a list of POS transformations", () => {
    const input = "She ran after the dog.";
    const target = "She ran after the dogs.";
    const generated = qpos.getPOSTransformations(input,target);
    const expected = ["NN|NNS"];
    expect(generated).toEqual(expected);
  })

  // it("checks for a POS match", () => {
  //   const optimalResponses = [
  //     "Bill swept the floor while Andy painted the walls.",
  //     "Bill swept the floor, and Andy painted the walls.",
  //   ];
  //   const userResponse = "Billy swept the floor while Andy painted the walls.";
  //   var tester = new POSMatcher(optimalResponses);
  //
  //   //console.log("\nUser: " + userResponse + "\nOptimal: " + optimalResponses + "\nThe POS matcher returns false because it doesn't read Billy as a proper noun.")
  //   const posMatch = tester.checkMatch(userResponse);
  //   expect(posMatch.posMatch).toEqual(false);
  // })

  // it("checks for an exact match", () => {
  //   const optimalResponses = [
  //     "Bill swept the floor while Andy painted the walls.",
  //     "Bill swept the floor, and Andy painted the walls.",
  //   ];
  //   const userResponse = "Bill swept the floor while Andy painted the walls.";
  //   var tester = new POSMatcher(optimalResponses);
  //
  //   const exactMatch = tester.checkMatch(userResponse);
  //   expect(exactMatch.exactMatch).toEqual(true);
  // })
  //
  // it("checks for an exact match in spacing", () => {
  //   const optimalResponses = [
  //     "Bill swept the floor while Andy painted the walls.",
  //     "Bill swept the floor, and Andy painted the walls.",
  //   ];
  //   const userResponse = "Bill swept the floor while     Andy painted the walls.";
  //   var tester = new POSMatcher(optimalResponses);
  //
  //   const exactMatch = tester.checkMatch(userResponse);
  //   expect(exactMatch.exactMatch).toEqual(true); //we remove spaces in between words
  // })
  //
  // it("checks for a POS match with arbitray spacing", () => {
  //   const optimalResponses = [
  //     "Bill swept the floor while Andy painted the walls.",
  //     "Bill swept the floor, and Andy spainted the walls.",
  //   ];
  //   const userResponse = "Bill swept the floor while     Andy painted the walls.";
  //   var tester = new POSMatcher({optimalResponses: optimalResponses});
  //
  //   const posMatch = tester.checkMatch(userResponse);
  //   // console.log("\nInside the arbitrary spacing, posMatch:\n", posMatch)
  //   expect(posMatch.posMatch).toEqual(true);
  // })
  //
  // it("checks for a POS match with lowercase name", () => {
  //   const optimalResponses = [
  //     "Bill swept the floor while Andy painted the walls.",
  //     "Bill swept the floor, and Andy spainted the walls.",
  //   ];
  //   const userResponse = "bill swept the floor while Andy painted the walls.";
  //   var tester = new POSMatcher({optimalResponses: optimalResponses});
  //
  //   const posMatch = tester.checkMatch(userResponse);
  //   expect(posMatch.posMatch).toEqual(false);
  // })

  // it("checks for a POS match on one instance of firebase data", () => {
  //   var data = responseData.getPOSTestingData();
  //   var optimalResponses = [];
  //   for (var key in data.responses){
  //     if(data.responses[key].optimal){
  //       optimalResponses.push(data.responses[key].text)
  //     }
  //   }
  //   // console.log("Optimal responses: ", optimalResponses)
  //
  //   const userResponse = "Bill swept the floor while Jane painted the walls.";
  //   var tester = new POSMatcher({optimalResponses: optimalResponses});
  //
  //   const posMatch = tester.checkMatch(userResponse);
  //   // console.log("\nA positive POS match:\n", posMatch)
  //   expect(posMatch.posMatch).toEqual(true);
  // })
  //
  // it("checks for an exact match on an entire set of responses from firebase", () => {
  //   var data = responseData.getPOSTestingData();
  //   var optimalResponses = [];
  //   var studentResponses = [];
  //   for (var key in data.responses){
  //     if(data.responses[key].optimal){
  //       optimalResponses.push(data.responses[key].text)
  //     }
  //     else {
  //       studentResponses.push(data.responses[key].text)
  //     }
  //   }
  //
  //   const tester = new POSMatcher({optimalResponses: optimalResponses});
  //   studentResponses.forEach((studentResponse) => {
  //     var exactMatch = tester.checkMatch(studentResponse);
  //     expect(exactMatch.exactMatch).toEqual(false);
  //   })
  // })
})
