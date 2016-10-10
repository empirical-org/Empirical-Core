import {
  getConceptResultsForSentenceCombining,
  errorFree
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

export function calculateScoreForLesson (questions) {
  let correct = 0;
  // if the first attempt is found, has no errors,
  // and the response is optimal, mark as correct.
  questions.forEach((question)=>{
    const firstAttempt = question.attempts[0];
    if (firstAttempt.found && errorFree(firstAttempt) && firstAttempt.response.optimal ) {
      correct += 1
    }
  })
  return Math.round((correct / questions.length) * 100 ) / 100;
}
