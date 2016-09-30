import {hashToCollection} from '../../libs/hashToCollection'
import Question from '../../libs/question'
import DiagnosticQuestion from '../../libs/diagnosticQuestion'

export default function checkAnswer(question, response, mode="default") {
  const Brain = mode === "default" ? Question : DiagnosticQuestion
  var fields = {
    prompt: question.prompt,
    responses: hashToCollection(question.responses)
  }
  var newQuestion = new Brain(fields);
  var newResponse = newQuestion.checkMatch(response);
  return newResponse;
}
