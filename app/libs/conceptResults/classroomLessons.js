import _ from 'underscore'

export function generate(lessonQuestionData, studentSessionData, modifications) {
  return []
}

export function generateConceptResult(questionData, studentSubmission) {
    return {
        concept_uid: 'lessons-placeholder',
        question_type: 'lessons-slide',
        metadata: {
            correct: 1,
            directions: questionData.prompt,
            prompt: questionData.prompt,
            answer: studentSubmission.data,
        },
    }
}

export function generateConceptResultForQuestion(questionData, studentSubmissions) {
  return _.mapObject(studentSubmissions, (submission, studentID) => {
      return generateConceptResult(questionData, submission)
  })
}
