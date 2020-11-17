const removeTitleCardQuestions = (questions) => questions.filter(q => q.type !== 'TL')

export const questionCount = (playLesson) => {
  return removeTitleCardQuestions(playLesson.questionSet).length
}

const unansweredQuestionCount = (playLesson) => {
  return removeTitleCardQuestions(playLesson.unansweredQuestions).length
}

export const answeredQuestionCount = (playLesson) => questionCount(playLesson) - unansweredQuestionCount(playLesson)

const getPreviewProgressPercent = (questionSet, questionToPreview) => {
  const questionKeys = questionSet.map(questionObject => questionObject.question.key);
  if(!questionToPreview) {
    return (1 / questionSet.length) * 100;
  } else {
    const { key } = questionToPreview;
    return ((questionKeys.indexOf(key) + 1) / questionSet.length) * 100;
  }
}

export const getProgressPercent = ({ playLesson, previewMode, questionToPreview }) => {
  let percent;
  if (!previewMode && playLesson && playLesson.unansweredQuestions && playLesson.questionSet) {
    percent = ((answeredQuestionCount(playLesson)) / questionCount(playLesson)) * 100
  } else if(previewMode && playLesson.questionSet) {
    const { questionSet } = playLesson;
    percent = getPreviewProgressPercent(questionSet, questionToPreview)
  } else {
    percent = 0;
  }
  return percent;
}
