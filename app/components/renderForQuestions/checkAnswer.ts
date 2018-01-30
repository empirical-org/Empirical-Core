import { hashToCollection } from '../../libs/hashToCollection';
import Question from '../../libs/question';
import DiagnosticQuestion from '../../libs/diagnosticQuestion';
import {checkSentenceCombining} from 'quill-marking-logic'

export default function checkAnswer(question, response, responses) {
  const fields = {
    responses: hashToCollection(responses),
    questionUID: question.key,
    focusPoints: hashToCollection(question.focusPoints),
    incorrectSequences: hashToCollection(question.incorrectSequences),
  };
  const newResponse = checkSentenceCombining(fields.questionUID, response, fields.responses, fields.focusPoints, fields.incorrectSequences);
  console.log('newResponse', newResponse)
  return {response: newResponse};
}
