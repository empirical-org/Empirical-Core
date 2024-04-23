import { checkGrammarQuestion } from '../../Shared/quill-marking-logic/src/main';
import { hashToCollection } from '../../Shared/index';

export default function checkAnswer(question, response, responses, mode= 'default') {
  const fields = {
    responses: responses ? hashToCollection(responses) : [],
    questionUID: question.key
  };
  const focusPoints = question.focusPoints ? hashToCollection(question.focusPoints).sort((a, b) => a.order - b.order) : [];
  const incorrectSequences = question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [];
  const defaultConceptUID = question.modelConceptUID || question.concept_uid
  const responseObj = checkGrammarQuestion(fields.questionUID, response, fields.responses, focusPoints, incorrectSequences, defaultConceptUID)
  return {response: responseObj};
}
