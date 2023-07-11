import { hashToCollection } from '../../../Shared/index';
import { formattedCues } from '../formattedCues';

export function getConceptResultsForAttempt(question, attemptIndex, question_type, defaultInstructions = '') {
  let directions;
  directions = question.instructions || defaultInstructions;
  if (question.cues && question.cues[0] !== '') {
    directions += ` ${formattedCues(question.cues)}`;
  }

  let lastFeedback;
  if (attemptIndex > 0) {
    lastFeedback = question.attempts[attemptIndex - 1].response.feedback;
  }

  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
  const answer = question.attempts[attemptIndex].response.text;
  const attemptNumber = attemptIndex + 1;
  let conceptResults = [];
  if (question.attempts[attemptIndex].response) {
    conceptResults = hashToCollection(question.attempts[attemptIndex].response.conceptResults) || [];
  }
  if (conceptResults.length === 0 && question_type === 'sentence-fragment-expansion') {
    return;
  }
  if (conceptResults.length === 0) {
    let score;
    if (question.attempts[attemptIndex].response) {
      score = question.attempts[attemptIndex].response.optimal;
    }
    conceptResults = [{
      conceptUID: question.conceptID,
      correct: score || false,
    }];
  }
  return conceptResults.map(conceptResult => ({
    concept_uid: conceptResult.conceptUID,
    question_type,
    metadata: lastFeedback ? {
      correct: conceptResult.correct ? 1 : 0,
      directions,
      lastFeedback,
      prompt,
      attemptNumber,
      answer,
      question_uid: question.key,
      question_concept_uid: question.conceptID
    } :
      {
        correct: conceptResult.correct ? 1 : 0,
        directions,
        prompt,
        attemptNumber,
        answer,
        question_uid: question.key,
        question_concept_uid: question.conceptID
      },
  }));
}
