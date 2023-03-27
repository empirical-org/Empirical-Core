import { hashToCollection } from '../../../Shared/index';
import { formattedCues } from '../formattedCues';

export function getConceptResultsForSentenceCombining(question) {
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
  const answer = question.attempts[0].response.text;
  let conceptResults = [];
  if (question.attempts[0].response) {
    const conceptResultObject = question.attempts[0].response.conceptResults || question.attempts[0].response.concept_results
    conceptResults = hashToCollection(conceptResultObject) || [];
  } else {
    conceptResults = [];
  }
  if (conceptResults.length === 0) {
    conceptResults = [{
      conceptUID: question.conceptID,
      correct: false,
    }];
  }
  let directions = question.instructions || 'Combine the sentences.';
  if (question.cues && question.cues[0] !== '') {
    directions += ` ${formattedCues(question.cues)}`;
  }
  return conceptResults.map(conceptResult => ({
    concept_uid: conceptResult.conceptUID,
    question_type: 'sentence-combining',
    metadata: {
      correct: conceptResult.correct ? 1 : 0,
      directions,
      prompt,
      answer,
    },
  }));
}
