import expect from 'expect';
import data from '../dataFromLesson';
import {
  getConceptResultsForQuestion,
  getNestedConceptResultsForAllQuestions,
  getConceptResultsForAllQuestions,
  embedQuestionNumbers,
  calculateScoreForLesson,
} from '../../app/libs/conceptResults/sentenceCombiningLesson'

describe("Getting concept results from an answered SC object", () => {
  const questions = data;

  it("can get the results for all questions", () => {
    const expected = [
      [
        {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown it is mature.',
                attemptNumber: 1,
                correct: 0,
                directions: 'Combine the sentences into one sentence. Use the word in the box.',
                prompt: 'A coconut is mature. It is brown.'
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown. it is mature.',
                attemptNumber: 2,
                correct: 0,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.'
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown, it is mature.',
                attemptNumber: 3,
                correct: 1,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.'
            }
        }, {
            concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
            metadata: {
                answer: 'As soon as a coconut is brown, it is mature.',
                attemptNumber: 3,
                correct: 1,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.'
            }
        }]
        ,
        [
          {
            concept_uid: '555cYi-MZKeyAV-98U4DyA',
            metadata: {
              correct: 1,
              directions: "Combine the sentences into one sentence. Use the word in the box.",
              prompt: "A coconut ripens.\nIt is filled with water.",
              answer: "Until a coconut ripens, it is filled with water.",
              attemptNumber: 1
            }
          },
          {
            concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
            metadata: {
              correct: 1,
              directions: "Combine the sentences into one sentence. Use the word in the box.",
              prompt: "A coconut ripens.\nIt is filled with water.",
              answer: "Until a coconut ripens, it is filled with water.",
              attemptNumber: 1,
            }
          }
        ],
        [{
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
                attemptNumber: 1,
                correct: 0,
                directions: 'Combine the sentences into one sentence. Use the word in the box.',
                prompt: 'The weather is warm.\nCoconut palms grow.'
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
                attemptNumber: 2,
                correct: 0,
                directions: 'Try again. How could this sentence be shorter and more concise?',
                prompt: 'The weather is warm.\nCoconut palms grow.'
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
                attemptNumber: 3,
                correct: 0,
                directions: 'Try again. How could this sentence be shorter and more concise?',
                prompt: 'The weather is warm.\nCoconut palms grow.'
            }
        }]

    ]

    const generated = getNestedConceptResultsForAllQuestions(data)
    expect(expected).toEqual(generated)
  })

  it("can embed the question numbers ", () => {
    const expected = [
      [
        {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown it is mature.',
                attemptNumber: 1,
                correct: 0,
                directions: 'Combine the sentences into one sentence. Use the word in the box.',
                prompt: 'A coconut is mature. It is brown.',
                questionNumber: 1
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown. it is mature.',
                attemptNumber: 2,
                correct: 0,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.',
                questionNumber: 1
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown, it is mature.',
                attemptNumber: 3,
                correct: 1,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.',
                questionNumber: 1
            }
        }, {
            concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
            metadata: {
                answer: 'As soon as a coconut is brown, it is mature.',
                attemptNumber: 3,
                correct: 1,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.',
                questionNumber: 1
            }
        }]
        ,
        [
          {
            concept_uid: '555cYi-MZKeyAV-98U4DyA',
            metadata: {
              correct: 1,
              directions: "Combine the sentences into one sentence. Use the word in the box.",
              prompt: "A coconut ripens.\nIt is filled with water.",
              answer: "Until a coconut ripens, it is filled with water.",
              attemptNumber: 1,
              questionNumber: 2
            }
          },
          {
            concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
            metadata: {
              correct: 1,
              directions: "Combine the sentences into one sentence. Use the word in the box.",
              prompt: "A coconut ripens.\nIt is filled with water.",
              answer: "Until a coconut ripens, it is filled with water.",
              attemptNumber: 1,
              questionNumber: 2
            }
          }
        ],
        [{
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
                attemptNumber: 1,
                correct: 0,
                directions: 'Combine the sentences into one sentence. Use the word in the box.',
                prompt: 'The weather is warm.\nCoconut palms grow.',
                questionNumber: 3
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
                attemptNumber: 2,
                correct: 0,
                directions: 'Try again. How could this sentence be shorter and more concise?',
                prompt: 'The weather is warm.\nCoconut palms grow.',
                questionNumber: 3
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
                attemptNumber: 3,
                correct: 0,
                directions: 'Try again. How could this sentence be shorter and more concise?',
                prompt: 'The weather is warm.\nCoconut palms grow.',
                questionNumber: 3
            }
        }]

    ]
    const generated = embedQuestionNumbers(getNestedConceptResultsForAllQuestions(data))
    expect(expected).toEqual(generated)
  })

  it("can embed the flattened array of concept results with embedded question numbers", () => {
    const expected = [
        {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown it is mature.',
                attemptNumber: 1,
                correct: 0,
                directions: 'Combine the sentences into one sentence. Use the word in the box.',
                prompt: 'A coconut is mature. It is brown.',
                questionNumber: 1
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown. it is mature.',
                attemptNumber: 2,
                correct: 0,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.',
                questionNumber: 1
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'As soon as a coconut is brown, it is mature.',
                attemptNumber: 3,
                correct: 1,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.',
                questionNumber: 1
            }
        }, {
            concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
            metadata: {
                answer: 'As soon as a coconut is brown, it is mature.',
                attemptNumber: 3,
                correct: 1,
                directions: 'There may be an error. How could you update the punctuation?',
                prompt: 'A coconut is mature. It is brown.',
                questionNumber: 1
            }
        },
          {
            concept_uid: '555cYi-MZKeyAV-98U4DyA',
            metadata: {
              correct: 1,
              directions: "Combine the sentences into one sentence. Use the word in the box.",
              prompt: "A coconut ripens.\nIt is filled with water.",
              answer: "Until a coconut ripens, it is filled with water.",
              attemptNumber: 1,
              questionNumber: 2
            }
          },
          {
            concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
            metadata: {
              correct: 1,
              directions: "Combine the sentences into one sentence. Use the word in the box.",
              prompt: "A coconut ripens.\nIt is filled with water.",
              answer: "Until a coconut ripens, it is filled with water.",
              attemptNumber: 1,
              questionNumber: 2
            }
          },
          {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
                attemptNumber: 1,
                correct: 0,
                directions: 'Combine the sentences into one sentence. Use the word in the box.',
                prompt: 'The weather is warm.\nCoconut palms grow.',
                questionNumber: 3
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
                attemptNumber: 2,
                correct: 0,
                directions: 'Try again. How could this sentence be shorter and more concise?',
                prompt: 'The weather is warm.\nCoconut palms grow.',
                questionNumber: 3
            }
        }, {
            concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            metadata: {
                answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
                attemptNumber: 3,
                correct: 0,
                directions: 'Try again. How could this sentence be shorter and more concise?',
                prompt: 'The weather is warm.\nCoconut palms grow.',
                questionNumber: 3
            }
        }
    ]

    const generated = getConceptResultsForAllQuestions(data)
    expect(expected).toEqual(generated)
  })

  it('can calculate the percentage of first attempts that are correct', ()=>{
    const expected = 0.33;
    const generated = calculateScoreForLesson(data);
    expect(expected).toEqual(generated)
  })
});
