import { hashToCollection } from '../../../Shared/index';
import { formattedCues } from '../formattedCues';

export function getConceptResultsForFillInTheBlanks(question) {
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
  let answer = question.attempts[0].submitted;
  let conceptResults = [];
  const responseObject = question.attempts[0].response;
  if (responseObject) {
    const conceptResultObject = responseObject.conceptResults || responseObject.concept_results
    conceptResults = hashToCollection(conceptResultObject) || [];
    answer = responseObject.text;
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
  return conceptResults.map((conceptResult, i) => ({
    concept_uid: conceptResult.conceptUID,
    question_type: 'fill-in-the-blanks',
    metadata: {
      correct: conceptResult.correct ? 1 : 0,
      directions,
      prompt,
      answer,
      attemptNumber: i + 1
    },
  }));
}
