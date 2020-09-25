import expect from 'expect';

import conceptResults from './conceptResultsWithMetadata.js';

import data from '../jsonFromDiagnostic';
import {
    getConceptResultsForQuestion,
    getNestedConceptResultsForAllQuestions,
    getConceptResultsForAllQuestions,
    embedQuestionNumbers
} from '../../libs/conceptResults/diagnostic';

describe('Getting concept results from an answered SC object', () => {
  const questions = data;
  const rideHomeWithQNumber = Object.assign({}, conceptResults.rideHome);
  rideHomeWithQNumber.metadata.questionNumber = 1;

  it('can get the results for a single SF question', () => {
    const expected =
        // [
      [{
        concept_uid: 'j89kdRGDVjG8j37A12p37Q',
        metadata: {
          answer: 'Fragment',
          correct: 1,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Listening to music on the ride home.',
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-identification',
      }, {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-expansion',
      }, {
        concept_uid: 'iUE6tekeyep8U385dtmVfQ',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-expansion',
      }];
    const generated = getConceptResultsForQuestion(data[0]);
    expect(expected).toEqual(generated);
  });

  it('can get the results for a single SC question', () => {
    const expected = [{
      concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
      metadata: {
        answer: 'Marcella wore a sweater since it was snowing.',
        correct: 1,
        directions: 'Combine the sentences. (After, Even though, Since)',
        prompt: 'It was snowing. Marcella wore a sweater.',
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
      metadata: {
        answer: 'Marcella wore a sweater since it was snowing.',
        correct: 1,
        directions: 'Combine the sentences. (After, Even though, Since)',
        prompt: 'It was snowing. Marcella wore a sweater.',
      },
      question_type: 'sentence-combining',
    }];
    const generated = getConceptResultsForQuestion(data[2]);
    expect(generated).toEqual(expected);
  });

  it('can get the results for all questions', () => {
    const expected = [
      [{
        concept_uid: 'j89kdRGDVjG8j37A12p37Q',
        metadata: {
          answer: 'Fragment',
          correct: 1,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Listening to music on the ride home.',
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-identification',
      }, {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-expansion',
      },
                // conceptResult.rideHome,
        {
          concept_uid: 'iUE6tekeyep8U385dtmVfQ',
          metadata: {
            answer: 'I am listening to music on the ride home.',
            correct: 1,
            directions: 'Add/change as few words as you can to change this fragment into a sentence.',
            prompt: 'Listening to music on the ride home.',
            attemptNumber: 1,
          },
          question_type: 'sentence-fragment-expansion',
        }
      ],
      [{
        concept_uid: 'LH3szu784pXA5k2N9lxgdA',
        metadata: {
          answer: 'Fragment',
          correct: 0,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Go away.',
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-identification',
      }, {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I want you to go away.',
          correct: 0,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Go away.',
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-expansion',
      }],
      [{
        concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
        metadata: {
          answer: 'Marcella wore a sweater since it was snowing.',
          correct: 1,
          directions: 'Combine the sentences. (After, Even though, Since)',
          prompt: 'It was snowing. Marcella wore a sweater.',
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
        metadata: {
          answer: 'Marcella wore a sweater since it was snowing.',
          correct: 1,
          directions: 'Combine the sentences. (After, Even though, Since)',
          prompt: 'It was snowing. Marcella wore a sweater.',
        },
        question_type: 'sentence-combining',
      }]
    ];
    const generated = getNestedConceptResultsForAllQuestions(data);
    expect(generated).toEqual(expected);
  });

  it('can embed the question numbers ', () => {
    const expected = [
      [{
        concept_uid: 'j89kdRGDVjG8j37A12p37Q',
        metadata: {
          answer: 'Fragment',
          correct: 1,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Listening to music on the ride home.',
          questionNumber: 1,
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-identification',
      }, {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
          questionNumber: 1,
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-expansion',
      },
        rideHomeWithQNumber
      ],
      [{
        concept_uid: 'LH3szu784pXA5k2N9lxgdA',
        metadata: {
          answer: 'Fragment',
          correct: 0,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Go away.',
          questionNumber: 2,
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-identification',
      }, {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I want you to go away.',
          correct: 0,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Go away.',
          questionNumber: 2,
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-expansion',
      }],
      [{
        concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
        metadata: {
          answer: 'Marcella wore a sweater since it was snowing.',
          correct: 1,
          directions: 'Combine the sentences. (After, Even though, Since)',
          prompt: 'It was snowing. Marcella wore a sweater.',
          questionNumber: 3,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
        metadata: {
          answer: 'Marcella wore a sweater since it was snowing.',
          correct: 1,
          directions: 'Combine the sentences. (After, Even though, Since)',
          prompt: 'It was snowing. Marcella wore a sweater.',
          questionNumber: 3,
        },
        question_type: 'sentence-combining',
      }]
    ];
    const generated = embedQuestionNumbers(getNestedConceptResultsForAllQuestions(data));
    expect(generated).toEqual(expected);
  });

  it('can embed the flattened array of concept results with embedded question numbers', () => {
    const expected = [{
      concept_uid: 'j89kdRGDVjG8j37A12p37Q',
      metadata: {
        answer: 'Fragment',
        correct: 1,
        directions: 'Is this a sentence or a fragment?',
        prompt: 'Listening to music on the ride home.',
        questionNumber: 1,
        attemptNumber: 1,
      },
      question_type: 'sentence-fragment-identification',
    }, {
      concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
      metadata: {
        answer: 'I am listening to music on the ride home.',
        correct: 1,
        directions: 'Add/change as few words as you can to change this fragment into a sentence.',
        prompt: 'Listening to music on the ride home.',
        questionNumber: 1,
        attemptNumber: 1,
      },
      question_type: 'sentence-fragment-expansion',
    },
      rideHomeWithQNumber, {
        concept_uid: 'LH3szu784pXA5k2N9lxgdA',
        metadata: {
          answer: 'Fragment',
          correct: 0,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Go away.',
          questionNumber: 2,
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-identification',
      }, {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I want you to go away.',
          correct: 0,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Go away.',
          questionNumber: 2,
          attemptNumber: 1,
        },
        question_type: 'sentence-fragment-expansion',
      }, {
        concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
        metadata: {
          answer: 'Marcella wore a sweater since it was snowing.',
          correct: 1,
          directions: 'Combine the sentences. (After, Even though, Since)',
          prompt: 'It was snowing. Marcella wore a sweater.',
          questionNumber: 3,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
        metadata: {
          answer: 'Marcella wore a sweater since it was snowing.',
          correct: 1,
          directions: 'Combine the sentences. (After, Even though, Since)',
          prompt: 'It was snowing. Marcella wore a sweater.',
          questionNumber: 3,
        },
        question_type: 'sentence-combining',
      }
    ];

    const generated = getConceptResultsForAllQuestions(data);
    expect(generated).toEqual(expected);
  });
});
