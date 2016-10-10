import {
  getConceptResultsForSentenceCombining
} from './sentenceCombiningLessonQuestion'

export function getConceptResultsForQuestion (question) {
  return getConceptResultsForSentenceCombining(question)
}

export function getNestedConceptResultsForAllQuestions (questions) {
  return questions.map((question) => {
    return getConceptResultsForQuestion(question)
  })
}

export function embedQuestionNumbers (nestedConceptResultArray) {
  return nestedConceptResultArray.map((conceptResultArray, index)=> {
    return conceptResultArray.map((conceptResult) => {
      conceptResult.metadata.questionNumber = index + 1
      return conceptResult
    })
  })
}

export function getConceptResultsForAllQuestions (questions) {
  const nested = getNestedConceptResultsForAllQuestions(questions)
  const withKeys = embedQuestionNumbers(nested)
  return [].concat.apply([], withKeys) // Flatten array
}
