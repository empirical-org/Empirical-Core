import {hashToCollection} from '../../libs/hashToCollection'
import Question from '../../libs/question'

export default function checkAnswer(question, refs) {
  var fields = {
    prompt: question.prompt,
    responses: hashToCollection(question.responses)
  }
  var newQuestion = new Question(fields);
  var response = newQuestion.checkMatch(refs.response.value);
  return response;
}
