import { hashToCollection } from '../hashToCollection';
import { formattedCues } from '../formattedCues';

export function getConceptResultsForFillInTheBlanks(question) {
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
  const answer = question.attempts[0].submitted;
  let conceptResults = [];
  if (question.attempts[0].response) {
    conceptResults = hashToCollection(question.attempts[0].response.conceptResults) || [];
  } else {
    conceptResults = [];
  }
  if (conceptResults.length === 0) {
    conceptResults = [{
      conceptUID: question.conceptID,
      correct: false,
    }];
  }
  let directions = question.instructions || 'Fill in the blanks.';
  if (question.cues && question.cues[0] !== '') {
    directions += ` ${formattedCues(question.cues)}`;
  }
  return conceptResults.map(conceptResult => ({
    concept_uid: conceptResult.conceptUID,
    question_type: 'fill-in-the-blanks',
    metadata: {
      correct: conceptResult.correct ? 1 : 0,
      directions,
      prompt,
      answer,
    },
  }));
}
