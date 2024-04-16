import {caseStartMatch, caseStartChecker} from './case_start_match'
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
    question_uid: "questionOne"
  },
  {
    id: 2,
    text: "My dog took another nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: "questionTwo"
  }
]

describe('The caseStartMatch function', () => {

  it('Should return true if the response string starts with a lowercase letter', () => {
    const responseString = "my dog took a nap.";
    expect(caseStartMatch(responseString, savedResponses)).toBeTruthy()
  });

  it('Should return false if the response string does not start with a lowercase letter', () => {
    const responseString = "My dog took a nap.";
    expect(caseStartMatch(responseString, savedResponses)).toBeFalsy()
  });

});

describe('The caseStartChecker', () => {

  it('Should return a partialResponse object if the response string starts with a lowercase letter', () => {
    const responseString = "my dog took a nap.";
    const partialResponse =  {
      feedback: feedbackStrings.caseError,
      author: 'Capitalization Hint',
      parent_id: getTopOptimalResponse(savedResponses).id,
      concept_results: [
        conceptResultTemplate('S76ceOpAWR-5m-k47nu6KQ')
      ],
    }
    expect(caseStartChecker(responseString, savedResponses).feedback).toEqual(partialResponse.feedback);
    expect(caseStartChecker(responseString, savedResponses).author).toEqual(partialResponse.author);
    expect(caseStartChecker(responseString, savedResponses).parent_id).toEqual(partialResponse.parent_id);
    expect(caseStartChecker(responseString, savedResponses).concept_results.length).toEqual(partialResponse.concept_results.length);
  });

  it('Should return undefined if the response string does not start with a lowercase letter', () => {
    const responseString = "My dog took a nap.";
    expect(caseStartChecker(responseString, savedResponses)).toEqual(undefined);
  });

})
