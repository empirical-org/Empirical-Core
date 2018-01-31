import { hashToCollection } from '../../libs/hashToCollection';
import _ from 'underscore'
import Question from '../../libs/question';
import DiagnosticQuestion from '../../libs/diagnosticQuestion';
import {checkSentenceCombining} from 'quill-marking-logic'

export default function checkAnswer(question, response, responses) {
  const fields = {
    responses: responses ? hashToCollection(responses) : [],
    questionUID: question.key,
    focusPoints: question.focusPoints ? hashToCollection(question.focusPoints): [],
    incorrectSequences: question.incorrectSequences ? hashToCollection(_.compact(question.incorrectSequences)) : [],
  };
  const newResponse = checkSentenceCombining(fields.questionUID, response, fields.responses, fields.focusPoints, fields.incorrectSequences);
  console.log('newResponse', newResponse)
  return {response: newResponse};
}
