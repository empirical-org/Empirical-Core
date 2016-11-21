import {hashToCollection} from '../../libs/hashToCollection'
import Question from '../../libs/question'
import DiagnosticQuestion from '../../libs/diagnosticQuestion'

export default function checkAnswer(question, response, responses, mode="default") {
  const Brain = mode === "default" ? Question : DiagnosticQuestion
  var fields = {
    prompt: question.prompt,
    responses: hashToCollection(responses)
  }
  console.log(fields.responses)
  var newQuestion = new Brain(fields);
  var newResponse = newQuestion.checkMatch(response);
  return newResponse;
}
