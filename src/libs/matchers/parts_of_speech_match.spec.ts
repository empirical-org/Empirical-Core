// import { assert } from 'chai';
// import {partsOfSpeechMatch, partsOfSpeechChecker} from './parts_of_speech_match'
// import {Response} from '../../interfaces'
// import {feedbackStrings} from '../constants/feedback_strings'
// import {conceptResultTemplate} from '../helpers/concept_result_template'
// import {getTopOptimalResponse} from '../sharedResponseFunctions'

// const prompt = 'My dog took a nap.'
// const savedResponses: Array<Response> = [
//   {
//     id: 1,
//     text: "My sleepy dog took a nap.",
//     feedback: "Good job, that's a sentence!",
//     optimal: true,
//     count: 2,
//     question_uid: 'question 1'
//   },
//   {
//     id: 2,
//     text: "My happy dog took a long nap.",
//     feedback: "Good job, that's a sentence!",
//     optimal: true,
//     count: 1,
//     question_uid: 'question 2'
//   }
// ]

// describe('The partsOfSpeechMatch function', () => {

//     it('should return a partial response object if there is a response with the same parts of speech tags as the submission', () => {
//         const responseString = "My goofy dog took a short nap.";
//         assert.ok(partsOfSpeechMatch(responseString, savedResponses));
//     });

//     it('should return undefined if there is no response with the same parts of speech tags as the submission', () => {
//         const responseString = prompt;
//         assert.notOk(partsOfSpeechMatch(responseString, savedResponses));
//     });

// })

// describe('The partsOfSpeechChecker function', () => {

//     it('should return a partialResponse object if the response string finds a parts of speech match', () => {
//       const responseString = "My goofy dog took a short nap.";
//         const returnValue = partsOfSpeechChecker(responseString, savedResponses)
//         assert.equal(returnValue.author, savedResponses[1].author);
//         assert.equal(returnValue.feedback, savedResponses[1].feedback);
//         assert.equal(returnValue.optimal, savedResponses[1].optimal);
//         assert.equal(returnValue.concept_results, savedResponses[1].concept_results);
//         assert.equal(returnValue.parent_id, savedResponses[1].id);

//     });

//     it('should return undefined if the response string does not match the parts of speech of any response', () => {
//         const responseString = 'My grumpy dog took a nap.';
//         const returnValue = partsOfSpeechChecker(responseString, savedResponses)
//         assert.notOk(returnValue);
//     });

// })
