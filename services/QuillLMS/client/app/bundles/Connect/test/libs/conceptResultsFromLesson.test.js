import expect from 'expect';

import {
  calculateScoreForLesson,
  embedQuestionNumbers,
  getConceptResultsForAllQuestions,
  getNestedConceptResultsForAllQuestions
} from '../../libs/conceptResults/lesson';
import data from '../dataFromLesson';

describe('Getting concept results from an answered SC object', () => {
  const questions = data;

  it('can get the results for all questions', () => {
    const expected = [
      [
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 1,
            answer: 'As soon as a coconut is brown it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'There may be an error. How could you update the punctuation?',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 2,
            answer: 'As soon as a coconut is brown. it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 3,
            answer: 'As soon as a coconut is brown, it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        },
        {
          concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 3,
            answer: 'As soon as a coconut is brown, it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        },
        {
          concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 3,
            answer: 'As soon as a coconut is brown, it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        }
      ],
      [
        {
          concept_uid: '555cYi-MZKeyAV-98U4DyA',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
            prompt: 'A coconut ripens. \nIt is filled with water.',
            attemptNumber: 1,
            answer: 'Until a coconut ripens, it is filled with water.',
            question_uid: '-KQS0vv8HESue3PrD8UV',
            question_concept_uid: '555cYi-MZKeyAV-98U4DyA'
          }
        },
        {
          concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
            prompt: 'A coconut ripens. \nIt is filled with water.',
            attemptNumber: 1,
            answer: 'Until a coconut ripens, it is filled with water.',
            question_uid: '-KQS0vv8HESue3PrD8UV',
            question_concept_uid: '555cYi-MZKeyAV-98U4DyA'
          }
        },
        {
          concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
            prompt: 'A coconut ripens. \nIt is filled with water.',
            attemptNumber: 1,
            answer: 'Until a coconut ripens, it is filled with water.',
            question_uid: '-KQS0vv8HESue3PrD8UV',
            question_concept_uid: '555cYi-MZKeyAV-98U4DyA'
          }
        }
      ],
      [
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 1,
            answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 2,
            answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 3,
            answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 4,
            answer: 'The weather is really freezing, so coconut trees palms grow as soon as it is warm again.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 5,
            answer: 'The weather is really cold, so coconut trees palms grow as soon as it is warm again.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ'
          }
        }
      ]
    ]

    const generated = getNestedConceptResultsForAllQuestions(data);
    expect(generated).toEqual(expected);
  });

  it('can embed the question numbers and score', () => {
    const expected = [
      [
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 1,
            answer: 'As soon as a coconut is brown it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 1,
            questionScore: 1
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'There may be an error. How could you update the punctuation?',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 2,
            answer: 'As soon as a coconut is brown. it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 1,
            questionScore: 1
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 3,
            answer: 'As soon as a coconut is brown, it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 1,
            questionScore: 1
          }
        },
        {
          concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 3,
            answer: 'As soon as a coconut is brown, it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 1,
            questionScore: 1
          }
        },
        {
          concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'A coconut is mature.\nIt is brown.',
            attemptNumber: 3,
            answer: 'As soon as a coconut is brown, it is mature.',
            question_uid: '-KQS0lZJ8RqWddG8qTeN',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 1,
            questionScore: 1
          }
        }
      ],
      [
        {
          concept_uid: '555cYi-MZKeyAV-98U4DyA',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
            prompt: 'A coconut ripens. \nIt is filled with water.',
            attemptNumber: 1,
            answer: 'Until a coconut ripens, it is filled with water.',
            question_uid: '-KQS0vv8HESue3PrD8UV',
            question_concept_uid: '555cYi-MZKeyAV-98U4DyA',
            questionNumber: 2,
            questionScore: 1
          }
        },
        {
          concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
            prompt: 'A coconut ripens. \nIt is filled with water.',
            attemptNumber: 1,
            answer: 'Until a coconut ripens, it is filled with water.',
            question_uid: '-KQS0vv8HESue3PrD8UV',
            question_concept_uid: '555cYi-MZKeyAV-98U4DyA',
            questionNumber: 2,
            questionScore: 1
          }
        },
        {
          concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
          question_type: 'sentence-combining',
          metadata: {
            correct: 1,
            directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
            prompt: 'A coconut ripens. \nIt is filled with water.',
            attemptNumber: 1,
            answer: 'Until a coconut ripens, it is filled with water.',
            question_uid: '-KQS0vv8HESue3PrD8UV',
            question_concept_uid: '555cYi-MZKeyAV-98U4DyA',
            questionNumber: 2,
            questionScore: 1
          }
        }
      ],
      [
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 1,
            answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 3,
            questionScore: 0
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 2,
            answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 3,
            questionScore: 0
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 3,
            answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 3,
            questionScore: 0
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 4,
            answer: 'The weather is really freezing, so coconut trees palms grow as soon as it is warm again.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 3,
            questionScore: 0
          }
        },
        {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          question_type: 'sentence-combining',
          metadata: {
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
            lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
            prompt: 'The weather is warm.\nCoconut palms grow.',
            attemptNumber: 5,
            answer: 'The weather is really cold, so coconut trees palms grow as soon as it is warm again.',
            question_uid: '-KQS0ZUV9IZiMiPmuZdB',
            question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
            questionNumber: 3,
            questionScore: 0
          }
        }
      ]
    ]
    const generated = embedQuestionNumbers(getNestedConceptResultsForAllQuestions(data));
    expect(generated).toEqual(expected);
  });

  it('can embed the flattened array of concept results with embedded question numbers and question scores', () => {
    const expected = [
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        question_type: 'sentence-combining',
        metadata: {
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'A coconut is mature.\nIt is brown.',
          attemptNumber: 1,
          answer: 'As soon as a coconut is brown it is mature.',
          question_uid: '-KQS0lZJ8RqWddG8qTeN',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 1,
          questionScore: 1
        }
      },
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        question_type: 'sentence-combining',
        metadata: {
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          lastFeedback: 'There may be an error. How could you update the punctuation?',
          prompt: 'A coconut is mature.\nIt is brown.',
          attemptNumber: 2,
          answer: 'As soon as a coconut is brown. it is mature.',
          question_uid: '-KQS0lZJ8RqWddG8qTeN',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 1,
          questionScore: 1
        }
      },
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        question_type: 'sentence-combining',
        metadata: {
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          prompt: 'A coconut is mature.\nIt is brown.',
          attemptNumber: 3,
          answer: 'As soon as a coconut is brown, it is mature.',
          question_uid: '-KQS0lZJ8RqWddG8qTeN',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 1,
          questionScore: 1
        }
      },
      {
        concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
        question_type: 'sentence-combining',
        metadata: {
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          prompt: 'A coconut is mature.\nIt is brown.',
          attemptNumber: 3,
          answer: 'As soon as a coconut is brown, it is mature.',
          question_uid: '-KQS0lZJ8RqWddG8qTeN',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 1,
          questionScore: 1
        }
      },
      {
        concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
        question_type: 'sentence-combining',
        metadata: {
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          prompt: 'A coconut is mature.\nIt is brown.',
          attemptNumber: 3,
          answer: 'As soon as a coconut is brown, it is mature.',
          question_uid: '-KQS0lZJ8RqWddG8qTeN',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 1,
          questionScore: 1
        }
      },
      {
        concept_uid: '555cYi-MZKeyAV-98U4DyA',
        question_type: 'sentence-combining',
        metadata: {
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
          prompt: 'A coconut ripens. \nIt is filled with water.',
          attemptNumber: 1,
          answer: 'Until a coconut ripens, it is filled with water.',
          question_uid: '-KQS0vv8HESue3PrD8UV',
          question_concept_uid: '555cYi-MZKeyAV-98U4DyA',
          questionNumber: 2,
          questionScore: 1
        }
      },
      {
        concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
        question_type: 'sentence-combining',
        metadata: {
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
          prompt: 'A coconut ripens. \nIt is filled with water.',
          attemptNumber: 1,
          answer: 'Until a coconut ripens, it is filled with water.',
          question_uid: '-KQS0vv8HESue3PrD8UV',
          question_concept_uid: '555cYi-MZKeyAV-98U4DyA',
          questionNumber: 2,
          questionScore: 1
        }
      },
      {
        concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
        question_type: 'sentence-combining',
        metadata: {
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
          prompt: 'A coconut ripens. \nIt is filled with water.',
          attemptNumber: 1,
          answer: 'Until a coconut ripens, it is filled with water.',
          question_uid: '-KQS0vv8HESue3PrD8UV',
          question_concept_uid: '555cYi-MZKeyAV-98U4DyA',
          questionNumber: 2,
          questionScore: 1
        }
      },
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        question_type: 'sentence-combining',
        metadata: {
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          attemptNumber: 1,
          answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
          question_uid: '-KQS0ZUV9IZiMiPmuZdB',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 3,
          questionScore: 0
        }
      },
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        question_type: 'sentence-combining',
        metadata: {
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          attemptNumber: 2,
          answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
          question_uid: '-KQS0ZUV9IZiMiPmuZdB',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 3,
          questionScore: 0
        }
      },
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        question_type: 'sentence-combining',
        metadata: {
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          attemptNumber: 3,
          answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
          question_uid: '-KQS0ZUV9IZiMiPmuZdB',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 3,
          questionScore: 0
        }
      },
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        question_type: 'sentence-combining',
        metadata: {
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          attemptNumber: 4,
          answer: 'The weather is really freezing, so coconut trees palms grow as soon as it is warm again.',
          question_uid: '-KQS0ZUV9IZiMiPmuZdB',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 3,
          questionScore: 0
        }
      },
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        question_type: 'sentence-combining',
        metadata: {
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          attemptNumber: 5,
          answer: 'The weather is really cold, so coconut trees palms grow as soon as it is warm again.',
          question_uid: '-KQS0ZUV9IZiMiPmuZdB',
          question_concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          questionNumber: 3,
          questionScore: 0
        }
      }
    ]

    const generated = getConceptResultsForAllQuestions(data);
    expect(generated).toEqual(expected);
  });

  it('can calculate the average score', () => {
    const expected = 0.67;
    const generated = calculateScoreForLesson(data);
    expect(generated).toEqual(expected);
  });
});
