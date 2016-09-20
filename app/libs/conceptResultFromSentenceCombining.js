import {hashToCollection} from './hashToCollection'

export function getConceptResultsForSentenceCombining(question) {
  const directions = question.instructions || "Combine the sentences.";
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")
  const answer = question.attempts[0].submitted
  let conceptResults = [];
  if (question.attempts[0].response) {
     conceptResults = hashToCollection(question.attempts[0].response.conceptResults) || []
  } else {
    conceptResults = [];
  }
  if (conceptResults.length === 0) {
    conceptResults = [{
      conceptUID: question.conceptID,
      correct: false
    }]
  }
  return conceptResults.map((conceptResult) => {
    return {
      concept_uid: conceptResult.conceptUID,
      metadata: {
        correct: conceptResult.correct ? 1 : 0,
        directions,
        prompt,
        answer
      }
    }
  })
}
