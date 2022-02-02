interface UnnecessaryEditTypeResponse {
  matched: boolean,
  unnecessaryEditType: string,
}

type UnnecessaryEditType = (originalText: string, editedText: string) => UnnecessaryEditTypeResponse;

const typeMatchers: UnnecessaryEditType[] = [
  unnecessarySpaceMatch,
  unnecessaryDeletionMatch,
  unnecessaryAdditionMatch
];

export const UNNECESSARY_SPACE = 'unnecessarySpace'
export const MULTIPLE_UNNECESSARY_DELETION = 'multipleUnnecessaryDeletion'
export const SINGLE_UNNECESSARY_DELETION = 'singleUnnecessaryDeletion'
export const MULTIPLE_UNNECESSARY_ADDITION = 'multipleUnnecessaryAddition'
export const SINGLE_UNNECESSARY_ADDITION = 'singleUnnecessaryAddition'
export const UNNECESSARY_CHANGE = 'unnecessaryChange'

export default function determineUnnecessaryEditType(originalText: string, editedText: string): string {
  for (const t of typeMatchers) {
    const r = t(originalText, editedText)
    if (r.matched) {
      return r.unnecessaryEditType
    }
  }
  return UNNECESSARY_CHANGE
}

export function unnecessarySpaceMatch(originalText: string, editedText: string): UnnecessaryEditTypeResponse {
  const response = { unnecessaryEditType: UNNECESSARY_SPACE, matched: false }
  const spaceRemovedOriginalText = removeSpaces(originalText)
  const spaceRemovedEditedText = removeSpaces(editedText)
  response.matched = ((spaceRemovedOriginalText === spaceRemovedEditedText) && (editedText.length > originalText.length))
  return response
}

export function unnecessaryAdditionMatch(originalText: string, editedText: string): UnnecessaryEditTypeResponse {
  const response = { unnecessaryEditType: SINGLE_UNNECESSARY_ADDITION, matched: false }
  const editedTextWords = editedText.split(' ')
  const originalTextWords = originalText.split(' ')
  const editedTextContainsMoreWords = editedTextWords.length > originalTextWords.length
  const editedTextContainsAllOriginalWords = originalTextWords.every(word => editedTextWords.includes(word))
  if (editedTextContainsMoreWords && editedTextContainsAllOriginalWords) {
    response.matched = true
    response.unnecessaryEditType = editedTextWords.length - originalTextWords.length > 1 ? MULTIPLE_UNNECESSARY_ADDITION : SINGLE_UNNECESSARY_ADDITION
  }
  return response
}

export function unnecessaryDeletionMatch(originalText: string, editedText: string): UnnecessaryEditTypeResponse {
  const response = { matched: false, unnecessaryEditType: SINGLE_UNNECESSARY_DELETION }
  const editedTextWords = editedText.split(' ').filter(word => word.length)
  const originalTextWords = originalText.split(' ').filter(word => word.length)
  const originalTextContainsMoreWords = editedTextWords.length < originalTextWords.length
  const originalTextContainsAllEditedWords = editedTextWords.every(word => originalTextWords.includes(word))
  if (originalTextContainsMoreWords && originalTextContainsAllEditedWords) {
    response.matched = true
    response.unnecessaryEditType = originalTextWords.length - editedTextWords.length > 1 ? MULTIPLE_UNNECESSARY_DELETION : SINGLE_UNNECESSARY_DELETION
  }
  return response
}

function removeSpaces(str: string) {
  return str.replace(/\s+/g, '')
}

export function unnecessarySpaceSplitResponse(originalText: string, editedText: string): string[] {
  const words = []
  let currentWord = ''
  // have to set index manually rather than using the built in one in `forEach` because sometimes we want to increase it by more than one
  let index = 0
  editedText.split('').forEach((letter, iteration) => {
    if (letter === originalText[index]) {
      currentWord+= letter
      index+=1
      // if we are on the last iteration, we should push in the current word
      iteration === editedText.length - 1 ? words.push(currentWord) : null
      return
    }

    if (currentWord.length) {
      words.push(currentWord)
      currentWord = ''
    }
    words.push(`{+- |${UNNECESSARY_SPACE}}`)
  })
  return words
}
