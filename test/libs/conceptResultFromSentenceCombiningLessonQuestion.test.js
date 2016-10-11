import expect from 'expect';
import data from '../dataFromLesson';
import {
  getConceptResultsForSentenceCombining,
  getConceptResultsForSentenceCombiningAttempt
} from '../../app/libs/conceptResults/sentenceCombiningLessonQuestion'

describe("Getting concept results from an answered SC object", () => {

  it("should have the correct score and concept uids with a question that was correct on the first attempt", () => {
    const question = data[1];
    const expected = [
      {
        concept_uid: '555cYi-MZKeyAV-98U4DyA',
        metadata: {
          correct: 1,
          directions: "Combine the sentences into one sentence. Use the word in the box. (Until)",
          prompt: "A coconut ripens.\nIt is filled with water.",
          attemptNumber: 1,
          answer: "Until a coconut ripens, it is filled with water."
        }
      },
      {
        concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
        metadata: {
          correct: 1,
          directions: "Combine the sentences into one sentence. Use the word in the box. (Until)",
          prompt: "A coconut ripens.\nIt is filled with water.",
          attemptNumber: 1,
          answer: "Until a coconut ripens, it is filled with water."
        }
      }
    ]
    const generated = getConceptResultsForSentenceCombining(question)

    expect(generated).toEqual(expected);
  });

  it("should have the correct score and concept uids with a question that was correct on the first attempt", () => {
    const question = data[1];
    const attempt = question["attempts"][0]
    const expected = [
      {
        concept_uid: '555cYi-MZKeyAV-98U4DyA',
        metadata: {
          correct: 1,
          directions: "Combine the sentences into one sentence. Use the word in the box. (Until)",
          prompt: "A coconut ripens.\nIt is filled with water.",
          answer: "Until a coconut ripens, it is filled with water.",
          attemptNumber: 1
        }
      },
      {
        concept_uid: 'Q8FfGSv4Z9L2r1CYOfvO9A',
        metadata: {
          correct: 1,
          directions: "Combine the sentences into one sentence. Use the word in the box. (Until)",
          prompt: "A coconut ripens.\nIt is filled with water.",
          answer: "Until a coconut ripens, it is filled with water.",
          attemptNumber: 1,
        }
      }
    ]
    const generated = getConceptResultsForSentenceCombiningAttempt(question, 0)

    expect(generated).toEqual(expected);
  });

  it("should have the correct score and concept uids with a question that was correct on the third attempt", () => {
    const question = data[0];
    const expected = [
      {
          concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
          metadata: {
              answer: 'As soon as a coconut is brown it is mature.',
              attemptNumber: 1,
              correct: 0,
              directions: 'Combine the sentences into one sentence. Use the word in the box. (As, Soon, As)',
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
    const generated = getConceptResultsForSentenceCombining(question)

    expect(generated).toEqual(expected);
  });

  it("should have the correct score and concept uids with a question that was incorrect on the third attempt", () => {
    const question = data[2];
    const expected = [{
        concept_uid: 'Ghym4auhaaukmnddY9mwfQ',
        metadata: {
            answer: 'The weather is cold, so coconut trees palms grow as soon as it is warm.',
            attemptNumber: 1,
            correct: 0,
            directions: 'Combine the sentences into one sentence. Use the word in the box. (As, Soon, As)',
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
    const generated = getConceptResultsForSentenceCombining(question)

    expect(generated).toEqual(expected);
  });
});
