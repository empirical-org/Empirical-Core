const removeTitleCardQuestions = (questions) => questions.filter(q => q.type !== 'TL')

export const questionCount = (playLesson) => {
  return removeTitleCardQuestions(playLesson.questionSet).length
}

const unansweredQuestionCount = (playLesson) => {
  return removeTitleCardQuestions(playLesson.unansweredQuestions).length
}

export const answeredQuestionCount = (playLesson) => questionCount(playLesson) - unansweredQuestionCount(playLesson)

export const getProgressPercent = (playLesson) => {
  let percent;
  if (playLesson && playLesson.unansweredQuestions && playLesson.questionSet) {
    percent = ((answeredQuestionCount(playLesson)) / questionCount(playLesson)) * 100
  } else {
    percent = 0;
  }
  return percent;
}
