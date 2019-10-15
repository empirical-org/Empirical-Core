declare function require(name:string): any
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import * as _ from 'underscore';
import {checkSentenceCombining, checkDiagnosticQuestion} from 'quill-marking-logic';
import { getParameterByName } from '../../libs/getParameterByName';
import { sendActivitySessionInteractionLog } from '../../libs/sendActivitySessionInteractionLog';


export default function checkAnswer(question, response, responses, mode='default') {
  sendActivitySessionInteractionLog(getParameterByName('student'), { info: 'answer check', current_question: question.key })
  const defaultConceptUID = question.modelConceptUID || question.conceptID
  const fields = {
    responses: responses ? hashToCollection(responses) : [],
    questionUID: question.key,
    focusPoints: question.focusPoints ? hashToCollection(question.focusPoints).sort((a, b) => a.order - b.order) : [],
    incorrectSequences: question.incorrectSequences ? hashToCollection(_.compact(question.incorrectSequences)) : [],
    defaultConceptUID
  };
  const newResponse = checkSentenceCombining(fields.questionUID, response, fields.responses, fields.focusPoints, fields.incorrectSequences, fields.defaultConceptUID)
  return {response: newResponse};
}
