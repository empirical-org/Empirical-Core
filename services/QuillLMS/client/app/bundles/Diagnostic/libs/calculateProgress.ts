import playDiagnostic from '../interfaces/playDiagnostic.ts';
import Question from '../interfaces/question.ts';

const removeTitleCardQuestions = (questions: Array<Question>) => questions.filter(q => q.type !== 'TL')

export const questionCount = (playDiagnostic: playDiagnostic) => {
  return removeTitleCardQuestions(playDiagnostic.questionSet).length
}

const unansweredQuestionCount = (playDiagnostic: playDiagnostic) => {
  return removeTitleCardQuestions(playDiagnostic.unansweredQuestions).length
}

export const answeredQuestionCount = (playDiagnostic: playDiagnostic) => questionCount(playDiagnostic) - unansweredQuestionCount(playDiagnostic);

export const getProgressPercent = (playDiagnostic: playDiagnostic) => {
  let percent;
  if (playDiagnostic && playDiagnostic.unansweredQuestions && playDiagnostic.questionSet) {
    percent = ((answeredQuestionCount(playDiagnostic)) / questionCount(playDiagnostic)) * 100
  } else {
    percent = 0;
  }
  return percent;
}
