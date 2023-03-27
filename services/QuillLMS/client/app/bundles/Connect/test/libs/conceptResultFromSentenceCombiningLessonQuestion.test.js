import expect from 'expect';

import {
    getConceptResultsForSentenceCombining,
    getConceptResultsForSentenceCombiningAttempt
} from '../../libs/conceptResults/sentenceCombiningLessonQuestion';
import data from '../dataFromLesson';

describe('Getting concept results from an answered SC object', () => {
  it('should have the correct score and concept uids with a question that was correct on the first attempt', () => {
    const question = data[1].question;
    const expected = [{
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
    }];
    const generated = getConceptResultsForSentenceCombining(question);

    expect(generated).toEqual(expected);
  });

  it('should have the correct score and concept uids with a question that was correct on the first attempt', () => {
    const question = data[1].question;
    const attempt = question.attempts[0];
    const expected = [{
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
    }];
    const generated = getConceptResultsForSentenceCombiningAttempt(question, 0);

    expect(generated).toEqual(expected);
  });

  it('should have the correct score and concept uids with a question that was correct on the third attempt', () => {
    const question = data[0].question;
    const expected = [
      {
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
      }
    ];
    const generated = getConceptResultsForSentenceCombining(question);

    expect(generated).toEqual(expected);
  });

  it('should have the correct score and concept uids with a question that was incorrect on the fifth attempt', () => {
    const question = data[2].question;
    const expected = [{
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
    }];
    const generated = getConceptResultsForSentenceCombining(question);

    expect(generated).toEqual(expected);
  });
});
