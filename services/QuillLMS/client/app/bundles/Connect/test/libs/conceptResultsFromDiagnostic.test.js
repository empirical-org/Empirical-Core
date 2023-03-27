import expect from 'expect';
import {
    embedQuestionNumbers, getConceptResultsForAllQuestions, getConceptResultsForQuestion,
    getNestedConceptResultsForAllQuestions
} from '../../libs/conceptResults/diagnostic';
import data from '../jsonFromDiagnostic';
import conceptResults from './conceptResultsWithMetadata.js';

describe('Getting concept results from an answered SC object',
  () => {
    const questions = data;
    const rideHomeWithQNumber = Object.assign({},
      conceptResults.rideHome);
    rideHomeWithQNumber.metadata.questionNumber = 1;

    it('can get the results for a single SF question',
      () => {
        const expected = [
          {
            concept_uid: 'j89kdRGDVjG8j37A12p37Q',
            metadata: {
              answer: 'Fragment',
              correct: 1,
              directions: 'Is this a sentence or a fragment?',
              prompt: 'Listening to music on the ride home.',
              attemptNumber: 1,
            },
            question_type: 'sentence-fragment-identification',
          },
          {
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
        ];
        const generated = getConceptResultsForQuestion(data[0]);
        expect(expected).toEqual(generated);

      });

    it('can get the results for a single SC question', () => {
      const expected = [
        {
          concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences. (After, Even though, Since)',
            prompt: 'It was snowing. Marcella wore a sweater.',
            answer: 'Marcella wore a sweater since it was snowing.',
            attemptNumber: 1
          }
        },
        {
          concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences. (After, Even though, Since)',
            prompt: 'It was snowing. Marcella wore a sweater.',
            answer: 'Marcella wore a sweater since it was snowing.',
            attemptNumber: 2
          }
        }
      ];
      const generated = getConceptResultsForQuestion(data[2]);
      expect(generated).toEqual(expected);

    });

    it('can get the results for all questions', () => {
      const expected = [
        [
          {
            concept_uid: 'j89kdRGDVjG8j37A12p37Q',
            question_type: 'sentence-fragment-identification',
            metadata: {
              correct: 1,
              directions: 'Is this a sentence or a fragment?',
              prompt: 'Listening to music on the ride home.',
              answer: 'Fragment',
              attemptNumber: 1
            }
          },
          {
            concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
            question_type: 'sentence-fragment-expansion',
            metadata: {
              correct: 1,
              directions: 'Add/change as few words as you can to change this fragment into a sentence.',
              prompt: 'Listening to music on the ride home.',
              answer: 'I am listening to music on the ride home.',
              attemptNumber: 1
            }
          },
          {
            concept_uid: 'iUE6tekeyep8U385dtmVfQ',
            question_type: 'sentence-fragment-expansion',
            metadata: {
              correct: 1,
              directions: 'Add/change as few words as you can to change this fragment into a sentence.',
              prompt: 'Listening to music on the ride home.',
              attemptNumber: 1,
              answer: 'I am listening to music on the ride home.'
            }
          }
        ],
        [
          {
            concept_uid: 'LH3szu784pXA5k2N9lxgdA',
            question_type: 'sentence-fragment-identification',
            metadata: {
              correct: 0,
              directions: 'Is this a sentence or a fragment?',
              prompt: 'Go away.',
              answer: 'Fragment',
              attemptNumber: 1
            }
          },
          {
            concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
            question_type: 'sentence-fragment-expansion',
            metadata: {
              correct: 0,
              directions: 'Add/change as few words as you can to change this fragment into a sentence.',
              prompt: 'Go away.',
              answer: 'I want you to go away.',
              attemptNumber: 1
            }
          }
        ],
        [
          {
            concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
            question_type: 'sentence-combining',
            metadata: {
              correct: 1,
              directions: 'Combine the sentences. (After, Even though, Since)',
              prompt: 'It was snowing. Marcella wore a sweater.',
              answer: 'Marcella wore a sweater since it was snowing.',
              attemptNumber: 1
            }
          },
          {
            concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
            question_type: 'sentence-combining',
            metadata: {
              correct: 1,
              directions: 'Combine the sentences. (After, Even though, Since)',
              prompt: 'It was snowing. Marcella wore a sweater.',
              answer: 'Marcella wore a sweater since it was snowing.',
              attemptNumber: 2
            }
          }
        ]
      ];
      const generated = getNestedConceptResultsForAllQuestions(data);
      expect(generated).toEqual(expected);

    });

    it('can embed the question numbers ',
      () => {
        const expected = [
          [
            {
              concept_uid: 'j89kdRGDVjG8j37A12p37Q',
              question_type: 'sentence-fragment-identification',
              metadata: {
                correct: 1,
                directions: 'Is this a sentence or a fragment?',
                prompt: 'Listening to music on the ride home.',
                answer: 'Fragment',
                attemptNumber: 1,
                questionNumber: 1
              }
            },
            {
              concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
              question_type: 'sentence-fragment-expansion',
              metadata: {
                correct: 1,
                directions: 'Add/change as few words as you can to change this fragment into a sentence.',
                prompt: 'Listening to music on the ride home.',
                answer: 'I am listening to music on the ride home.',
                attemptNumber: 1,
                questionNumber: 1
              }
            },
            {
              concept_uid: 'iUE6tekeyep8U385dtmVfQ',
              question_type: 'sentence-fragment-expansion',
              metadata: {
                correct: 1,
                directions: 'Add/change as few words as you can to change this fragment into a sentence.',
                prompt: 'Listening to music on the ride home.',
                attemptNumber: 1,
                answer: 'I am listening to music on the ride home.',
                questionNumber: 1
              }
            }
          ],
          [
            {
              concept_uid: 'LH3szu784pXA5k2N9lxgdA',
              question_type: 'sentence-fragment-identification',
              metadata: {
                correct: 0,
                directions: 'Is this a sentence or a fragment?',
                prompt: 'Go away.',
                answer: 'Fragment',
                attemptNumber: 1,
                questionNumber: 2
              }
            },
            {
              concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
              question_type: 'sentence-fragment-expansion',
              metadata: {
                correct: 0,
                directions: 'Add/change as few words as you can to change this fragment into a sentence.',
                prompt: 'Go away.',
                answer: 'I want you to go away.',
                attemptNumber: 1,
                questionNumber: 2
              }
            }
          ],
          [
            {
              concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
              question_type: 'sentence-combining',
              metadata: {
                correct: 1,
                directions: 'Combine the sentences. (After, Even though, Since)',
                prompt: 'It was snowing. Marcella wore a sweater.',
                answer: 'Marcella wore a sweater since it was snowing.',
                attemptNumber: 1,
                questionNumber: 3
              }
            },
            {
              concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
              question_type: 'sentence-combining',
              metadata: {
                correct: 1,
                directions: 'Combine the sentences. (After, Even though, Since)',
                prompt: 'It was snowing. Marcella wore a sweater.',
                answer: 'Marcella wore a sweater since it was snowing.',
                attemptNumber: 2,
                questionNumber: 3
              }
            }
          ]
        ];
        const generated = embedQuestionNumbers(getNestedConceptResultsForAllQuestions(data));
        expect(generated).toEqual(expected);
      });

    it('can embed the flattened array of concept results with embedded question numbers', () => {
      const expected = [
        {
          concept_uid: 'j89kdRGDVjG8j37A12p37Q',
          question_type: 'sentence-fragment-identification',
          metadata: {
            correct: 1,
            directions: 'Is this a sentence or a fragment?',
            prompt: 'Listening to music on the ride home.',
            answer: 'Fragment',
            attemptNumber: 1,
            questionNumber: 1
          }
        },
        {
          concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
          question_type: 'sentence-fragment-expansion',
          metadata: {
            correct: 1,
            directions: 'Add/change as few words as you can to change this fragment into a sentence.',
            prompt: 'Listening to music on the ride home.',
            answer: 'I am listening to music on the ride home.',
            attemptNumber: 1,
            questionNumber: 1
          }
        },
        {
          concept_uid: 'iUE6tekeyep8U385dtmVfQ',
          question_type: 'sentence-fragment-expansion',
          metadata: {
            correct: 1,
            directions: 'Add/change as few words as you can to change this fragment into a sentence.',
            prompt: 'Listening to music on the ride home.',
            attemptNumber: 1,
            answer: 'I am listening to music on the ride home.',
            questionNumber: 1
          }
        },
        {
          concept_uid: 'LH3szu784pXA5k2N9lxgdA',
          question_type: 'sentence-fragment-identification',
          metadata: {
            correct: 0,
            directions: 'Is this a sentence or a fragment?',
            prompt: 'Go away.',
            answer: 'Fragment',
            attemptNumber: 1,
            questionNumber: 2
          }
        },
        {
          concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
          question_type: 'sentence-fragment-expansion',
          metadata: {
            correct: 0,
            directions: 'Add/change as few words as you can to change this fragment into a sentence.',
            prompt: 'Go away.',
            answer: 'I want you to go away.',
            attemptNumber: 1,
            questionNumber: 2
          }
        },
        {
          concept_uid: '7H2IMZvq0VJ4Uvftyrw7Eg',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences. (After, Even though, Since)',
            prompt: 'It was snowing. Marcella wore a sweater.',
            answer: 'Marcella wore a sweater since it was snowing.',
            attemptNumber: 1,
            questionNumber: 3
          }
        },
        {
          concept_uid: 'nb0JW1r5pRB5ouwAzTgMbQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences. (After, Even though, Since)',
            prompt: 'It was snowing. Marcella wore a sweater.',
            answer: 'Marcella wore a sweater since it was snowing.',
            attemptNumber: 2,
            questionNumber: 3
          }
        }
      ];

      const generated = getConceptResultsForAllQuestions(data);
      expect(generated).toEqual(expected);

    });
  });
