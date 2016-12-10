import { hashToCollection } from '../../libs/hashToCollection';
import Question from '../../libs/question';
import DiagnosticQuestion from '../../libs/diagnosticQuestion';

export default function checkAnswer(question, response, responses, mode = 'default') {
  const Brain = mode === 'default' ? Question : DiagnosticQuestion;
  const fields = {
    prompt: question.prompt,
    responses: hashToCollection(responses),
    questionUID: question.key,
    focusPoints: hashToCollection(question.focusPoints),
  };
  const newQuestion = new Brain(fields);
  const newResponse = newQuestion.checkMatch(response);
  return newResponse;
}
