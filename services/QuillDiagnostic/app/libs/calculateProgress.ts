const removeTitleCardQuestions = (questions) => questions.filter(q => q.type !== 'TL')

export const questionCount = (playDiagnostic) => {
  return removeTitleCardQuestions(playDiagnostic.questionSet).length
}

const unansweredQuestionCount = (playDiagnostic) => {
  return removeTitleCardQuestions(playDiagnostic.unansweredQuestions).length
}

export const answeredQuestionCount = (playDiagnostic) => questionCount(playDiagnostic) - unansweredQuestionCount(playDiagnostic) - 1

export const getProgressPercent = (playDiagnostic) => {
  let percent;
  if (playDiagnostic && playDiagnostic.unansweredQuestions && playDiagnostic.questionSet) {
    percent = ((answeredQuestionCount(playDiagnostic)) / questionCount(playDiagnostic)) * 100
  } else {
    percent = 0;
  }
  return percent;
}
