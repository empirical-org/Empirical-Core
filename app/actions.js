/*
 * action types
 */

export const NEXT_QUESTION = 'NEXT_QUESTION'
export const LOAD_DATA = 'LOAD_DATA'
export const EXIT = 'EXIT'

export const SubmitActions = {
  NEXT_QUESTION,
  LOAD_DATA,
  EXIT
}

/*
 * action creators
 */

export function nextQuestion() {
  return { type: NEXT_QUESTION}
}

export function loadData(data) {
  return { type: LOAD_DATA, data}
}

export function exitToHome() {
  return { type: EXIT}
}
