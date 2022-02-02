import expect from 'expect';
import data from '../jsonFromDiagnostic';
import { getIdentificationConceptResult, getCompleteSentenceConceptResult, getAllSentenceFragmentConceptResults } from '../../libs/conceptResults/sentenceFragment';
import conceptResults from './conceptResultsWithMetadata.js';
describe('Getting concept results from an answered sf object', () => {
  const question = data[0].data;

  it('should have the correct score and concept uids', () => {
    const expected = {
      concept_uid: 'j89kdRGDVjG8j37A12p37Q',
      metadata: {
        answer: 'Fragment',
        attemptNumber: 1,
        correct: 1,
        directions: 'Is this a sentence or a fragment?',
        prompt: 'Listening to music on the ride home.',
      },
      question_type: 'sentence-fragment-identification',
    };
    const generated = getIdentificationConceptResult(question);

    expect(generated).toEqual(expected);
  });

  it('should label as a complete sentence', () => {
    const expected = {
      concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
      metadata: {
        answer: 'I am listening to music on the ride home.',
        attemptNumber: 1,
        correct: 1,
        directions: 'Add/change as few words as you can to change this fragment into a sentence.',
        prompt: 'Listening to music on the ride home.',
      },
      question_type: 'sentence-fragment-expansion',
    };
    const generated = getCompleteSentenceConceptResult(question);
    expect(generated).toEqual(expected);
  });

  it('should be able to get all the concept results for a question', () => {
    const expected = [
      {
        concept_uid: 'j89kdRGDVjG8j37A12p37Q',
        metadata: {
          answer: 'Fragment',
          attemptNumber: 1,
          correct: 1,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Listening to music on the ride home.',
        },
        question_type: 'sentence-fragment-identification',
      }, {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          attemptNumber: 1,
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
        },
        question_type: 'sentence-fragment-expansion',
      },
      // conceptResults.rideHome,
      {
		    concept_uid: 'iUE6tekeyep8U385dtmVfQ',
		    metadata: {
		      answer: 'I am listening to music on the ride home.',
          attemptNumber: 1,
		      correct: 1,
		      directions: 'Add/change as few words as you can to change this fragment into a sentence.',
		      prompt: 'Listening to music on the ride home.',
		    },
		    question_type: 'sentence-fragment-expansion',
		  }
    ];
    const generated = getAllSentenceFragmentConceptResults(question);
    expect(generated).toEqual(expected);
  });

  it('should not get identfied concept results for a question that needs no identification', () => {
    const expected = [
      {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          attemptNumber: 1,
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
        },
        question_type: 'sentence-fragment-expansion',
      },
      {
		    concept_uid: 'iUE6tekeyep8U385dtmVfQ',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          attemptNumber: 1,
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
        },
        question_type: 'sentence-fragment-expansion',
		  }
    ];
    const newQuestion = JSON.parse(JSON.stringify(question));
    newQuestion.needsIdentification = false;
    const generated = getAllSentenceFragmentConceptResults(newQuestion);
    expect(generated).toEqual(expected);
  });

  it('should not return a complete sentence cr for correctly identified sentences', () => {
    const given = {
      attempts: [
        {
          found: true,
          submitted: 'I am listening to music on the ride home.',
          posMatch: true,
          exactMatch: true,
          response: {
            conceptResults: {
              '-KPTKtoxE2UabAeg59Rr': {
                conceptUID: 'iUE6tekeyep8U385dtmVfQ',
                correct: true,
              },
            },
            count: 5,
            createdAt: '1471534068015',
            feedback: "<p>Great job! That's a strong sentence.</p>",
            optimal: true,
            text: 'I am listening to music on the ride home.',
            weak: false,
            key: '-KPTFz4xCW3ccaRQs2RI',
          },
        }
      ],
      isFragment: false,
      needsIdentification: true,
      identified: true,
      prompt: 'Listening to music on the ride home.',
      questionText: 'Go away.',
    };
    const expected = [
      {
        concept_uid: 'LH3szu784pXA5k2N9lxgdA',
        metadata: {
          answer: 'Sentence',
          attemptNumber: 1,
          correct: 1,
          directions: 'Is this a sentence or a fragment?',
          prompt: 'Listening to music on the ride home.',
        },
        question_type: 'sentence-fragment-identification',
      }, {
        concept_uid: 'KfA8-dg8FvlJz4eY0PkekA',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          attemptNumber: 1,
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
        },
        question_type: 'sentence-fragment-expansion',
      }, {
        concept_uid: 'iUE6tekeyep8U385dtmVfQ',
        metadata: {
          answer: 'I am listening to music on the ride home.',
          attemptNumber: 1,
          correct: 1,
          directions: 'Add/change as few words as you can to change this fragment into a sentence.',
          prompt: 'Listening to music on the ride home.',
        },
        question_type: 'sentence-fragment-expansion',
      }
    ];

    const generated = getAllSentenceFragmentConceptResults(given);
    expect(generated).toEqual(expected);
  });
});
