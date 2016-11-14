import _ from 'underscore'
import {diffWords} from 'diff';

export function checkChangeObjectMatch (userString, responses, stringManipulationFn) {
  responses = _.sortBy(responses, 'count').reverse()
  var matchedErrorType;
  const matched = _.find(responses, (response) => {
    const errorType = getErrorType(stringManipulationFn(response.text), stringManipulationFn(userString))
    matchedErrorType = errorType
    return errorType
  })
  if (matched) {
    return {
      response: matched,
      errorType: matchedErrorType
    }
  }
}

const ERROR_TYPES = {
  NO_ERROR: 'NO_ERROR',
  MISSING_WORD: "MISSING_WORD",
  ADDITIONAL_WORD: "ADDITIONAL_WORD",
  INCORRECT_WORD: "INCORRECT_WORD"
}

const getErrorType = (targetString, userString) => {
  const changeObjects = getChangeObjects(targetString, userString)
  const hasIncorrect = checkForIncorrect(changeObjects)
  const hasAdditions = checkForAdditions(changeObjects)
  const hasDeletions = checkForDeletions(changeObjects)
  if (hasIncorrect) {
    return ERROR_TYPES.INCORRECT_WORD
  } else if (hasAdditions) {
    return ERROR_TYPES.ADDITIONAL_WORD
  } else if (hasDeletions) {
    return ERROR_TYPES.MISSING_WORD
  } else {
    return
  }
}

const getChangeObjects = (targetString, userString) => {
  return diffWords(targetString, userString)
};

const errorLog = (text) => {
  // console.log("\n\n#####\n")
  // console.log(text)
  // console.log("\n#####\n")
}

const checkForIncorrect = (changeObjects) => {
  var tooLongError = false
  var found = false
  var foundCount = 0
  var coCount = 0
  changeObjects.forEach((current, index, array) => {
    if (current.removed || current.added) {
      coCount += 1
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.added && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length < 2 && index === array.length - 1) {
      foundCount += 1
    } else {
      foundCount += !!(current.removed && current.value.split(" ").filter(Boolean).length < 2 && array[index + 1].added) ? 1 : 0
    }
  })
  return !tooLongError && (foundCount === 1) && (coCount === 2)
}

const checkForAdditions = (changeObjects) => {
  var tooLongError = false
  var found = false
  var foundCount = 0
  var coCount = 0
  changeObjects.forEach((current, index, array) => {
    if (current.removed || current.added) {
      coCount += 1
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.added && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.added && current.value.split(" ").filter(Boolean).length < 2 && index === 0) {
      foundCount += 1
    } else {
      foundCount += !!(current.added && current.value.split(" ").filter(Boolean).length < 2 && !array[index - 1].removed) ? 1 : 0
    }
  })
  return !tooLongError && (foundCount === 1) && (coCount === 1)
}

const checkForDeletions = (changeObjects) => {
  var tooLongError = false
  var found = false
  var foundCount = 0
  var coCount = 0
  changeObjects.forEach((current, index, array) => {
    if (current.removed || current.added) {
      coCount += 1
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.added && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length < 2 && index === array.length - 1) {
      foundCount += 1
    } else {
      foundCount += !!(current.removed && current.value.split(" ").filter(Boolean).length < 2 && !array[index + 1].added) ? 1 : 0
    }
  })
  return !tooLongError && (foundCount === 1) && (coCount === 1)
}
