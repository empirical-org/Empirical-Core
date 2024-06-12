import { generateRegexMatchList, } from '../quill-marking-logic/src/libs/generateRegexMatchList'

export function isValidRegex(str) {
  try {
    const regex = new RegExp(str)
    return !!regex
  } catch (err) {
    return false
  }
}

export function isValidFocusPointOrIncorrectSequence(focusPointOrIncorrectSequence: string) {
  try {
    generateRegexMatchList(focusPointOrIncorrectSequence).map(particle => new RegExp(particle))
    return true
  } catch (err) {
    return false
  }
}

export function isValidAndNotEmptyRegex(string) {
  return string.length && isValidRegex(string)
}
