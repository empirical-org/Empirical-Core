import {diffWords} from 'diff';
import _ from 'lodash';

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
