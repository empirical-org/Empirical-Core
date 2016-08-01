import {diffWords} from 'diff';
import _ from 'lodash';
const ERROR_TYPES = {
  NO_ERROR: 'NO_ERROR',
  MISSING_WORD: "MISSING_WORD",
  ADDITIONAL_WORD: "ADDITIONAL_WORD",
  INCORRECT_WORD: "INCORRECT_WORD"
}


export function getChangeObjects (targetString, userString) {
  return diffWords(targetString, userString)
};

export function getChangeObjectsWithoutRemoved (targetString, userString) {
  const changeObjects = getChangeObjects(targetString, userString);
  return _.reject(changeObjects, (changeObject) => {
    return changeObject.removed
  })
}

export function getChangeObjectsWithoutAdded (targetString, userString) {
  const changeObjects = getChangeObjects(targetString, userString);
  return _.reject(changeObjects, (changeObject) => {
    return changeObject.added
  })
}

export function getErroneousWordLength (changeObjects) {
  const addedWord = _.filter(changeObjects, {added: true})[0]
  return addedWord.value.length || 0
}

export function getErroneousWordOffset (changeObjects) {
  const precedingObjects = _.takeWhile(changeObjects, (changeObject) => {
    return !changeObject.added
  })
  return _.reduce(precedingObjects, (sum, changeObject) => {
    return sum + changeObject.value.length
  }, 0)
}

export function getInlineStyleRangeObject (targetString, userString) {
  const changeObjects = getChangeObjectsWithoutRemoved(targetString, userString)
  return {
    length: getErroneousWordLength(changeObjects),
    offset: getErroneousWordOffset(changeObjects),
    style: "UNDERLINE"
  }
}

export function getErrorType (targetString, userString) {
  const changeObjects = getChangeObjects(targetString, userString)
  const hasIncorrect = _.some(changeObjects, (current, index, array) => {
    if (current.removed && index === array.length - 1) {
      return FALSE
    }
    return current.removed && (array[index + 1].added)
  })
  const hasAdditions = _.some(changeObjects, (current, index, array) => {
    if (current.added && index === 0) {
      return TRUE
    }
    return current.added && !array[index - 1].removed
  })
  const hasDeletions = _.some(changeObjects, (current, index, array) => {
    if (current.removed && index === array.length - 1) {
      return TRUE
    }
    return current.removed && !(array[index + 1].added)
  })
  if (hasIncorrect) {
    return ERROR_TYPES.INCORRECT_WORD
  } else if (hasAdditions) {
    return ERROR_TYPES.ADDITIONAL_WORD
  } else if (hasDeletions) {
    return ERROR_TYPES.MISSING_WORD
  } else {
    return ERROR_TYPES.NO_ERROR
  }
}
