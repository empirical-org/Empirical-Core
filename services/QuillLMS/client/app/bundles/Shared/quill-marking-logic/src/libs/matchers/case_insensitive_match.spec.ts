import * as _ from 'underscore'
import {caseInsensitiveMatch, caseInsensitiveChecker} from './case_insensitive_match'
import {Response} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "My dog took a nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 2,
    question_uid: "questionOne",
    key: "blue",
    concept_results: [{correct: true, conceptUID: 'l'}]
  },
  {
    id: 2,
    text: "My dog took another nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: "questionTwo",
    parent_id: "red",
    concept_results: [{correct: true, conceptUID: 'b'}]
  },
  {
    id: 3,
    text: "My friend took a nap.",
    feedback: "Hmm. Not correct.",
    optimal: false,
    count: 1,
    question_uid: "questionTwo",
    parent_id: "green",
    concept_results: [{correct: true, conceptUID: 'b'}]
  }
]

describe('The caseInsensitiveMatch function', () => {

  it('Should return true if the lowercased response string matches a lowercased partial response', () => {
    const responseString = "my dog took a nap.";
    expect(caseInsensitiveMatch(responseString, savedResponses, false)).toBeTruthy()
  });

  it('Should return false if the lowercased response string does not match a lowercased partial response', () => {
    const responseString = "my cat took a nap.";
    expect(caseInsensitiveMatch(responseString, savedResponses, false)).toBeFalsy()
  });

});

describe('The caseInsensitiveChecker', () => {

  it('Should return a partialResponse object if the lowercased response string matches a lowercased partial response', () => {
    const responseString = "my dog took a nap.";
    const partialResponse =  {
      feedback: feedbackStrings.caseError,
      author: 'Capitalization Hint',
      parent_id: caseInsensitiveMatch(responseString, savedResponses, false).id,
      concept_results: [
        conceptResultTemplate('S76ceOpAWR-5m-k47nu6KQ')
      ],
    }
    expect(caseInsensitiveChecker(responseString, savedResponses).feedback).toEqual(partialResponse.feedback);
    expect(caseInsensitiveChecker(responseString, savedResponses).author).toEqual(partialResponse.author);
    expect(caseInsensitiveChecker(responseString, savedResponses).parent_id).toEqual(partialResponse.parent_id);
    expect(caseInsensitiveChecker(responseString, savedResponses).concept_results.length).toEqual(partialResponse.concept_results.length);
  });

  it('Should return undefined if the lowercased response string does not match a lowercased partial response', () => {
    const responseString = "my cat took a nap.";
    expect(caseInsensitiveChecker(responseString, savedResponses)).toEqual(undefined);
  });

  it('Should return the same concept results as the matched response if it is asked to', () => {
    const responseString = "my dog took a nap.";
    expect(_.isEqual(caseInsensitiveChecker(responseString, savedResponses, true).concept_results, caseInsensitiveMatch(responseString, savedResponses, false).concept_results)).toBeTruthy()
  });

  it('Should return a partialResponse object if the lowercased response string matches a lowercased optimal response and caseInsensitive flag is on', () => {
    const responseString = "My DOG took a nap.";
    const caseInsensitive = true
    const partialResponse =  {
      feedback: feedbackStrings.caseError,
      author: 'Capitalization Hint',
      parent_id: caseInsensitiveMatch(responseString, savedResponses, false).id,
      concept_results: [
        conceptResultTemplate('S76ceOpAWR-5m-k47nu6KQ')
      ],
    }
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).optimal).toBeFalsy();
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).feedback).toEqual(partialResponse.feedback);
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).author).toEqual(partialResponse.author);
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).parent_id).toEqual(partialResponse.parent_id);
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).concept_results.length).toEqual(partialResponse.concept_results.length);
  });

  it('Should return the exact matched response if the lowercased response string matches a lowercased optimal response and caseInsensitive flag is on but it is a diagnostic question', () => {
    const responseString = "My DOG took a nap.";
    const caseInsensitive = true
    const isDiagnosticFIB = true

    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive, isDiagnosticFIB).optimal).toBeTruthy();
  });

  it('Should return the exact matched response if the lowercased response string matches a lowercased partial response and caseInsensitive flag is on', () => {
    const responseString = "my FRIEND took a nap.";
    const caseInsensitive = true
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).optimal).toBeFalsy()
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).feedback).toEqual(savedResponses[2].feedback);
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).author).toEqual(savedResponses[2].author);
    expect(caseInsensitiveChecker(responseString, savedResponses, false, caseInsensitive).parent_id).toEqual(savedResponses[2].parent_id);
  });


})
