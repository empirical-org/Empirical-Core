/*
 * action types
 */
export const SUBMIT_RESPONSE = 'SUBMIT_RESPONSE'
export const NEXT_QUESTION = 'NEXT_QUESTION'
export const LOAD_DATA = 'LOAD_DATA'
export const EXIT = 'EXIT'
export const CLEAR_RESPONSES = 'CLEAR_RESPONSES'

export const SubmitActions = {
  SUBMIT_RESPONSE,
  NEXT_QUESTION,
  LOAD_DATA,
  EXIT,
  CLEAR_RESPONSES
}

/*
 * action creators
 */

export function submitResponse(response) {
  return { type: SUBMIT_RESPONSE, response}
}

export function clearResponses() {
  return { type: CLEAR_RESPONSES}
}


export function nextQuestion() {
  return { type: NEXT_QUESTION}
}

export function loadData(data) {
  return { type: LOAD_DATA, data}
}

export function exitToHome() {
  return { type: EXIT}
}
