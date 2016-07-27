import {hashToCollection} from '../../libs/hashToCollection'
import Question from '../../libs/question'

export default function checkAnswer(question, response) {
  var fields = {
    prompt: question.prompt,
    responses: hashToCollection(question.responses)
  }
  var newQuestion = new Question(fields);
  var newResponse = newQuestion.checkMatch(response);
  return newResponse;
}
