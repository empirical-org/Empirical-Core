import {
  getConceptResultsForSentenceCombining,
  errorFree
} from './sentenceCombiningLessonQuestion'

import {
  getAllSentenceFragmentConceptResults,
  calculateCorrectnessOfSentence
} from './sentenceFragment.js'

export function getConceptResultsForQuestion (questionObj) {
  if (questionObj.type === "SF") {
    return getAllSentenceFragmentConceptResults(questionObj.question)
  } else if (questionObj.type === "SC") {
    return getConceptResultsForSentenceCombining(questionObj.question)
  }
}

export function getNestedConceptResultsForAllQuestions (questions) {
  return questions.map((questionObj) => {
    return getConceptResultsForQuestion(questionObj)
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

export function getScoreForSentenceCombining (question) {
  const firstAttempt = question.attempts[0];
  if (firstAttempt.found && errorFree(firstAttempt) && firstAttempt.response.optimal ) {
    return 1;
  } else {
    return 0;
  }
}
export function getScoreForSentenceFragment (question) {
  const firstAttempt = question.attempts[0];
  if (question.identified && calculateCorrectnessOfSentence(firstAttempt) === 1) {
    return 1;
  } else {
    return 0;
  }
}

export function calculateScoreForLesson (questions) {
  let correct = 0;
  questions.forEach((question)=>{
    switch (question.type) {
      case 'SF':
        correct += getScoreForSentenceFragment(question.question)
        break;
      case 'SC':
        correct += getScoreForSentenceCombining(question.question)
        break
      default:
        throw new Error('question is not compatible type')
    }
  })
  return Math.round((correct / questions.length) * 100 ) / 100;
}
