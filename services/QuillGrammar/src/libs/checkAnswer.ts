declare function require(name:string);
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import * as _ from 'underscore'
import {checkGrammarQuestion} from 'quill-marking-logic'

export default function checkAnswer(question, response, responses, mode='default') {
  const fields = {
    responses: responses ? hashToCollection(responses) : [],
    questionUID: question.key
  };
  const newResponse = checkGrammarQuestion(fields.questionUID, response, fields.responses)
  return {response: newResponse};
}
