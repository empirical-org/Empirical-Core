declare function require(name: string);
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import * as _ from 'underscore'
import {checkGrammarQuestion} from 'quill-marking-logic'

export default function checkAnswer(question, response, responses, mode= 'default') {
  const fields = {
    responses: responses ? hashToCollection(responses) : [],
    questionUID: question.key
  };
  const defaultConceptUID = question.modelConceptUID || question.concept_uid
  const responseObj = checkGrammarQuestion(fields.questionUID, response, fields.responses, defaultConceptUID)
  return {response: responseObj};
}
