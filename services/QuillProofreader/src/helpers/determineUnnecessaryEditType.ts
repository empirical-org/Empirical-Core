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
  response.matched = removeSpaces(originalText) === removeSpaces(editedText)
  return response
}

export function unnecessaryAdditionMatch(originalText: string, editedText: string): UnnecessaryEditTypeResponse {
  const response = { unnecessaryEditType: SINGLE_UNNECESSARY_ADDITION, matched: false }
  const editedTextWords = editedText.split(' ')
  const originalTextWords = originalText.split(' ')
  response.matched = editedTextWords.length > originalTextWords.length
  if (editedTextWords.length > originalTextWords.length) {
    response.matched = true
    response.unnecessaryEditType = editedTextWords.length - originalTextWords.length > 1 ? MULTIPLE_UNNECESSARY_ADDITION : SINGLE_UNNECESSARY_ADDITION
  }
  return response
}

export function unnecessaryDeletionMatch(originalText: string, editedText: string): UnnecessaryEditTypeResponse {
  const response = { matched: false, unnecessaryEditType: SINGLE_UNNECESSARY_DELETION }
  const editedTextWords = editedText.split(' ')
  const originalTextWords = originalText.split(' ')
  if (originalTextWords.length > editedTextWords.length) {
    response.matched = true
    response.unnecessaryEditType = originalTextWords.length - editedTextWords.length > 1 ? MULTIPLE_UNNECESSARY_DELETION : SINGLE_UNNECESSARY_DELETION
  }
  return response
}

function removeSpaces(str: string) {
  return str.replace(/\s+/g, '')
}
