import {assert} from 'chai';
import {incorrectSequenceMatch, incorrectSequenceChecker} from './incorrect_sequence_match';
import {Response, IncorrectSequence} from '../../interfaces'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "Jared likes Edtech and startups.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 2,
    question_uid: "questionOne",
    key: 'one'
  },
  {
    id: 2,
    text: "Jared likes startups and Edtech.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: "questionOne",
    key: 'two'
  }
]

const incorrectSequences = [
  {
    text: 'early stage companies|||high potential companies',
    feedback: 'Inc 1',
    concept_results: [{correct: true, conceptUID: 'a'}],
    caseInsensitive: true
  },
  {
    text: 'because|||however',
    feedback: 'Inc 2',
    concept_results: [{correct: true, conceptUID: 'a'}]
  },
  {
    text: 'triangle ',
    feedback: 'Inc 3',
    concept_results: [{correct: true, conceptUID: 'a'}]
  },
  {
    text: '(startups.*){2,}',
    feedback: 'Inc 4',
    concept_results: [{correct: true, conceptUID: 'a'}]
  },
  {
    text: '^Emilia',
    feedback: 'Inc 5',
    concept_results: [{correct: true, conceptUID: 'a'}]
  },
  {
    text: 'fun.$',
    feedback: 'Inc 6',
    concept_results: [{correct: true, conceptUID: 'a'}]
  },
  {
    text: 'likes&&loves',
    feedback: 'Inc 7',
    concept_results: [{correct: true, conceptUID: 'a'}]
  },
  {
    text: '^Cissy',
    feedback: 'Inc 8',
    name: 'do not mention Cissy',
    concept_results: [{correct: true, conceptUID: 'a'}]
  }
]

describe('The incorrectSequenceMatch', () => {

  const negativeTests = [
    'Jared likes Edtech and startups.',
    'Jared likes startups and Edtech.',
    'Jared likes startups as well as Edtech.',
    'Jared likes startups as well as Edtech.',
    'Jared likes Edtech as well as Edtech.',
    'Donald likes startups as well as Edtech.',
    'Jared likes startups as well as Edtech.',
    'Jared loves startups and Edtech'
  ];

  const positiveTests = [
    'Jared likes early stage companies.',
    'Jared likes high potential companies.',
    'Jared likes Edtech because he likes startups.',
    'Jared likes Edtech and Edtech and triangle too.',
    'Jared likes startups and startups.',
    'Emilia likes startups as well as Edtech.',
    'Jared likes startups, Edtech, and fun.',
    'Jared likes startups and loves edtech.'
  ];

  positiveTests.forEach((test:string, i) => {
    it(`should find a incorrect sequence match: ${i}`, () => {
      assert.ok(incorrectSequenceMatch(test, incorrectSequences))
    });
  });

  negativeTests.forEach((test:string, i) => {
    it(`should not find a incorrect sequence match: ${i}`, () => {
      assert.notOk(incorrectSequenceMatch(test, incorrectSequences))
    });
  });
});

describe('The incorrectSequenceChecker', () => {

  it('Should return a partialResponse object if the response string matches an incorrect sequence', () => {
    const responseString = "Jared likes early stage companies.";
    const partialResponse =  {
      feedback: incorrectSequenceMatch(responseString, incorrectSequences).feedback,
      author: 'Incorrect Sequence Hint',
      parent_id: getTopOptimalResponse(savedResponses).id,
      concept_results: incorrectSequenceMatch(responseString, incorrectSequences).concept_results
    }
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).feedback, partialResponse.feedback);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).author, partialResponse.author);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).concept_results, partialResponse.concept_results);
  });

  it('Should return a partialResponse object if the response string matches an incorrect sequence case insensitively', () => {
    const responseString = "Jared likes EARLY STAGE COMPANIES.";
    const partialResponse =  {
      feedback: incorrectSequenceMatch(responseString, incorrectSequences).feedback,
      author: 'Incorrect Sequence Hint',
      parent_id: getTopOptimalResponse(savedResponses).id,
      concept_results: incorrectSequenceMatch(responseString, incorrectSequences).concept_results
    }
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).feedback, partialResponse.feedback);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).author, partialResponse.author);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).concept_results, partialResponse.concept_results);
  });

  it('Should return undefined if the response string does not match an incorrect sequence', () => {
    const responseString = "Jared likes Edtech and startups.";
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses), undefined);
  });

  it("Should return a partialResponse object with the incorrectSequence's name as the author if the response string matches an incorrect sequence with a name", () => {
    const responseString = "Cissy likes some companies.";
    const partialResponse =  {
      feedback: incorrectSequenceMatch(responseString, incorrectSequences).feedback,
      author: 'do not mention Cissy',
      parent_id: getTopOptimalResponse(savedResponses).id,
      concept_results: incorrectSequenceMatch(responseString, incorrectSequences).concept_results
    }

    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).feedback, partialResponse.feedback);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).author, partialResponse.author);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(incorrectSequenceChecker(responseString, incorrectSequences, savedResponses).concept_results, partialResponse.concept_results);
  });
})
