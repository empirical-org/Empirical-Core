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

export function getErroneousWordLength (changeObjects, key) {
  const addedWord = _.filter(changeObjects, {[key]: true})[0]
  return addedWord.value.length || 0
}

export function getErroneousWordOffset (changeObjects, key) {
  const precedingObjects = _.takeWhile(changeObjects, (changeObject) => {
    return !changeObject[key]
  })
  const offset = _.reduce(precedingObjects, (sum, changeObject) => {
    return sum + changeObject.value.length
  }, 0)

  //if the last changeObject is '.', it means that the last word was missing. Offset is incremented
  //because of the space at the end of the second last word that was also missing, but that is added automatically.
  //However, if the last word was simply misspelled, we don't need to increase the offset - the preceding space already exists
  if(changeObjects.length>=2 && changeObjects[changeObjects.length-1].value==='.' && changeObjects[changeObjects.length-2].added===undefined) {
    return offset+1
  } else {
    return offset
  }
}

export function getInlineStyleRangeObject (targetString, userString) {
  const changeObjects = getChangeObjectsWithoutRemoved(targetString, userString)
  return {
    length: getErroneousWordLength(changeObjects, 'added'),
    offset: getErroneousWordOffset(changeObjects, 'added'),
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

export function getMissingWordErrorString (changeObjects) {
  return changeObjects.map((changeObject) => {
    if (changeObject.removed) {
      return _.repeat(' ', changeObject.value.length)
    } else {
      return changeObject.value
    }
  }).join('')
}

export function getMissingInlineStyleRangeObject (targetString, userString) {
  const changeObjects = getChangeObjects(targetString, userString)
  const length = getErroneousWordLength(changeObjects, 'removed')
  return {
    length: (length===1) ? 1 : length-1, //edge case for commas
    offset: getErroneousWordOffset(changeObjects, 'removed'),
    style: "UNDERLINE"
  }
}

export function getAdditionalInlineStyleRangeObject (targetString, userString) {
  const changeObjects = getChangeObjects(targetString, userString)
  return {
    length: getErroneousWordLength(changeObjects, 'added') -1,
    offset: getErroneousWordOffset(changeObjects, 'added'),
    style: "UNDERLINE"
  }
}

export function generateStyleObjects (targetString, userString) {
  const errorType = getErrorType(targetString, userString);
  switch (errorType) {
    case ERROR_TYPES.INCORRECT_WORD:
      return {
        text: userString,
        inlineStyleRanges: [
          getInlineStyleRangeObject(targetString, userString)
        ]
      }
      break;
    case ERROR_TYPES.ADDITIONAL_WORD:
      return {
        text: userString,
        inlineStyleRanges: [
          getAdditionalInlineStyleRangeObject(targetString, userString)
        ]
      }
      break;
    case ERROR_TYPES.MISSING_WORD:
      return {
        text: getMissingWordErrorString(getChangeObjects(targetString, userString)),
        inlineStyleRanges: [
          getMissingInlineStyleRangeObject(targetString, userString)
        ]
      }
      break;
    default:
      return {
        text: userString,
        inlineStyleRanges: []
      }
  }
}
