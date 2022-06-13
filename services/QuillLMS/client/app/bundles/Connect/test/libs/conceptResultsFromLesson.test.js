import expect from 'expect';

import data from '../dataFromLesson';
import {
  getConceptResultsForQuestion,
  getNestedConceptResultsForAllQuestions,
  getConceptResultsForAllQuestions,
  embedQuestionNumbers,
  calculateScoreForLesson,
} from '../../libs/conceptResults/lesson';

describe('Getting concept results from an answered SC object', () => {
  const questions = data;

  it('can get the results for all questions', () => {
    const expected = [[{
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'As soon as a coconut is brown it is mature.',
        attemptNumber: 1,
        correct: 0,
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'As soon as a coconut is brown. it is mature.',
        attemptNumber: 2,
        correct: 0,
        lastFeedback: 'There may be an error. How could you update the punctuation?',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'As soon as a coconut is brown, it is mature.',
        attemptNumber: 3,
        correct: 1,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
      metadata: {
        answer: 'As soon as a coconut is brown, it is mature.',
        attemptNumber: 3,
        correct: 1,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
      },
      question_type: 'sentence-combining',
    },
    {
      concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
      metadata: {
        answer: 'As soon as a coconut is brown, it is mature.',
        attemptNumber: 3,
        correct: 1,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
      },
      question_type: 'sentence-combining',
    }], [{
      concept_uid: '555cYi-MZKeyAV-98U4DyA',
      metadata: {
        answer: 'Until a coconut ripens, it is filled with water.',
        attemptNumber: 1,
        correct: 1,
        directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
        prompt: 'A coconut ripens. \nIt is filled with water.',
      },
      question_type: 'sentence-combining',
    },
    {
      concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
      metadata: {
        answer: 'Until a coconut ripens, it is filled with water.',
        attemptNumber: 1,
        correct: 1,
        directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
        prompt: 'A coconut ripens. \nIt is filled with water.',
      },
      question_type: 'sentence-combining',
    },
    {
      concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
      metadata: {
        answer: 'Until a coconut ripens, it is filled with water.',
        attemptNumber: 1,
        correct: 1,
        directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
        prompt: 'A coconut ripens. \nIt is filled with water.',
      },
      question_type: 'sentence-combining',
    }], [{
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
        attemptNumber: 1,
        correct: 0,
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
        attemptNumber: 2,
        correct: 0,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
        attemptNumber: 3,
        correct: 0,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is really freezing, so coconut trees palms grow as soon as it is warm again.',
        attemptNumber: 4,
        correct: 0,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
      },
      question_type: 'sentence-combining',
    },
    {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is really cold, so coconut trees palms grow as soon as it is warm again.',
        attemptNumber: 5,
        correct: 0,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
      },
      question_type: 'sentence-combining',
    }]
    ];

    const generated = getNestedConceptResultsForAllQuestions(data);
    expect(generated).toEqual(expected);
  });

  it('can embed the question numbers and score', () => {
    const expected = [[{
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'As soon as a coconut is brown it is mature.',
        attemptNumber: 1,
        correct: 0,
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
        questionNumber: 1,
        questionScore: 0.6,
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'As soon as a coconut is brown. it is mature.',
        attemptNumber: 2,
        correct: 0,
        lastFeedback: 'There may be an error. How could you update the punctuation?',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
        questionNumber: 1,
        questionScore: 0.6,
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'As soon as a coconut is brown, it is mature.',
        attemptNumber: 3,
        correct: 1,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
        questionNumber: 1,
        questionScore: 0.6,
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
      metadata: {
        answer: 'As soon as a coconut is brown, it is mature.',
        attemptNumber: 3,
        correct: 1,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
        questionNumber: 1,
        questionScore: 0.6,
      },
      question_type: 'sentence-combining',
    },
    {
      concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
      metadata: {
        answer: 'As soon as a coconut is brown, it is mature.',
        attemptNumber: 3,
        correct: 1,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'A coconut is mature.\nIt is brown.',
        questionNumber: 1,
        questionScore: 0.6,
      },
      question_type: 'sentence-combining',
    }], [{
      concept_uid: '555cYi-MZKeyAV-98U4DyA',
      metadata: {
        answer: 'Until a coconut ripens, it is filled with water.',
        attemptNumber: 1,
        correct: 1,
        directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
        prompt: 'A coconut ripens. \nIt is filled with water.',
        questionNumber: 2,
        questionScore: 1.0,
      },
      question_type: 'sentence-combining',
    },
    {
      concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
      metadata: {
        answer: 'Until a coconut ripens, it is filled with water.',
        attemptNumber: 1,
        correct: 1,
        directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
        prompt: 'A coconut ripens. \nIt is filled with water.',
        questionNumber: 2,
        questionScore: 1.0,
      },
      question_type: 'sentence-combining',
    },
    {
      concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
      metadata: {
        answer: 'Until a coconut ripens, it is filled with water.',
        attemptNumber: 1,
        correct: 1,
        directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
        prompt: 'A coconut ripens. \nIt is filled with water.',
        questionNumber: 2,
        questionScore: 1.0,
      },
      question_type: 'sentence-combining',
    }], [{
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
        attemptNumber: 1,
        correct: 0,
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
        questionNumber: 3,
        questionScore: 0.0,
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
        attemptNumber: 2,
        correct: 0,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
        questionNumber: 3,
        questionScore: 0.0,
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
        attemptNumber: 3,
        correct: 0,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
        questionNumber: 3,
        questionScore: 0.0,
      },
      question_type: 'sentence-combining',
    }, {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is really freezing, so coconut trees palms grow as soon as it is warm again.',
        attemptNumber: 4,
        correct: 0,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
        questionNumber: 3,
        questionScore: 0.0,
      },
      question_type: 'sentence-combining',
    },
    {
      concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
      metadata: {
        answer: 'The weather is really cold, so coconut trees palms grow as soon as it is warm again.',
        attemptNumber: 5,
        correct: 0,
        lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
        directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
        prompt: 'The weather is warm.\nCoconut palms grow.',
        questionNumber: 3,
        questionScore: 0.0,
      },
      question_type: 'sentence-combining',
    }]
    ];
    const generated = embedQuestionNumbers(getNestedConceptResultsForAllQuestions(data));
    expect(generated).toEqual(expected);
  });

  it('can embed the flattened array of concept results with embedded question numbers and question scores', () => {
    const expected = [
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
          answer: 'As soon as a coconut is brown it is mature.',
          attemptNumber: 1,
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'A coconut is mature.\nIt is brown.',
          questionNumber: 1,
          questionScore: 0.6,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
          answer: 'As soon as a coconut is brown. it is mature.',
          attemptNumber: 2,
          correct: 0,
          lastFeedback: 'There may be an error. How could you update the punctuation?',
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'A coconut is mature.\nIt is brown.',
          questionNumber: 1,
          questionScore: 0.6,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
          answer: 'As soon as a coconut is brown, it is mature.',
          attemptNumber: 3,
          correct: 1,
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'A coconut is mature.\nIt is brown.',
          questionNumber: 1,
          questionScore: 0.6,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
        metadata: {
          answer: 'As soon as a coconut is brown, it is mature.',
          attemptNumber: 3,
          correct: 1,
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'A coconut is mature.\nIt is brown.',
          questionNumber: 1,
          questionScore: 0.6,
        },
        question_type: 'sentence-combining',
      },
      {
        concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
        metadata: {
          answer: 'As soon as a coconut is brown, it is mature.',
          attemptNumber: 3,
          correct: 1,
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'A coconut is mature.\nIt is brown.',
          questionNumber: 1,
          questionScore: 0.6,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: '555cYi-MZKeyAV-98U4DyA',
        metadata: {
          answer: 'Until a coconut ripens, it is filled with water.',
          attemptNumber: 1,
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
          prompt: 'A coconut ripens. \nIt is filled with water.',
          questionNumber: 2,
          questionScore: 1.0,
        },
        question_type: 'sentence-combining',
      },
      {
        concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
        metadata: {
          answer: 'Until a coconut ripens, it is filled with water.',
          attemptNumber: 1,
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
          prompt: 'A coconut ripens. \nIt is filled with water.',
          questionNumber: 2,
          questionScore: 1.0,
        },
        question_type: 'sentence-combining',
      },
      {
        concept_uid: 'bZmNou1vg97xYkCKG6sfTg',
        metadata: {
          answer: 'Until a coconut ripens, it is filled with water.',
          attemptNumber: 1,
          correct: 1,
          directions: 'Combine the sentences into one sentence. Use the joining word. (Until)',
          prompt: 'A coconut ripens. \nIt is filled with water.',
          questionNumber: 2,
          questionScore: 1.0,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
          answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
          attemptNumber: 1,
          correct: 0,
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          questionNumber: 3,
          questionScore: 0.0,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
          answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm again.',
          attemptNumber: 2,
          correct: 0,
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          questionNumber: 3,
          questionScore: 0.0,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
          answer: 'The weather is freezing, so coconut trees palms grow as soon as it is warm again.',
          attemptNumber: 3,
          correct: 0,
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          questionNumber: 3,
          questionScore: 0.0,
        },
        question_type: 'sentence-combining',
      }, {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
          answer: 'The weather is really freezing, so coconut trees palms grow as soon as it is warm again.',
          attemptNumber: 4,
          correct: 0,
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          questionNumber: 3,
          questionScore: 0.0,
        },
        question_type: 'sentence-combining',
      },
      {
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
          answer: 'The weather is really cold, so coconut trees palms grow as soon as it is warm again.',
          attemptNumber: 5,
          correct: 0,
          lastFeedback: 'Revise your work. Which joining word helps show the order of events? ',
          directions: 'Combine the sentences into one sentence. Use the joining word. (As soon as)',
          prompt: 'The weather is warm.\nCoconut palms grow.',
          questionNumber: 3,
          questionScore: 0.0,
        },
        question_type: 'sentence-combining',
      }
    ];

    const generated = getConceptResultsForAllQuestions(data);
    expect(generated).toEqual(expected);
  });

  it('can calculate the average score', () => {
    const expected = 0.53;
    const generated = calculateScoreForLesson(data);
    expect(generated).toEqual(expected);
  });
});
