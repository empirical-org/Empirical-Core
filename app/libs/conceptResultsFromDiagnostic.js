import {
  getAllSentenceFragmentConceptResults
} from './conceptResultFromSentenceFragment'
import {
  getConceptResultsForSentenceCombining
} from './conceptResultFromSentenceCombining'

export function getConceptResultsForQuestion (question) {
  if (question.type === "SF") {
    return getAllSentenceFragmentConceptResults(question.data)
  } else if (question.type === "SC") {
    return getConceptResultsForSentenceCombining(question.data)
  }
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
  return [].concat.apply([], withKeys)
}
