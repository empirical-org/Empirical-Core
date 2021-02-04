/*
 * action types
 */
export const SUBMIT_RESPONSE = 'SUBMIT_RESPONSE'
export const SUBMIT_RESPONSE_IMMEDIATE = 'SUBMIT_RESPONSE_IMMEDIATE'
export const SUBMIT_RESPONSE_ANON = 'SUBMIT_RESPONSE_ANON'
export const NEXT_QUESTION = 'NEXT_QUESTION'
export const LOAD_DATA = 'LOAD_DATA'
export const CLEAR_DATA = 'CLEAR_DATA'
export const EXIT = 'EXIT'
export const CLEAR_RESPONSES = 'CLEAR_RESPONSES'
export const CLEAR_RESPONSES_ANON = 'CLEAR_RESPONSES_ANON'
export const UPDATE_NAME = 'UPDATE_NAME'
export const START_QUESTION = 'START_QUESTION'
export const UPDATE_CURRENT_QUESTION = 'UPDATE_CURRENT_QUESTION'
export const SET_CURRENT_QUESTION = 'SET_CURRENT_QUESTION'
export const RESUME_PREVIOUS_SESSION = 'RESUME_PREVIOUS_SESSION'

export const SubmitActions = {
  SUBMIT_RESPONSE,
  SUBMIT_RESPONSE_IMMEDIATE,
  SUBMIT_RESPONSE_ANON,
  NEXT_QUESTION,
  LOAD_DATA,
  CLEAR_DATA,
  EXIT,
  CLEAR_RESPONSES,
  CLEAR_RESPONSES_ANON,
  UPDATE_NAME,
  START_QUESTION,
  UPDATE_CURRENT_QUESTION,
  SET_CURRENT_QUESTION,
  RESUME_PREVIOUS_SESSION
}

/*
 * action creators
 */

export function submitResponse(response) {
  return { type: SUBMIT_RESPONSE, response}
}

export function submitResponseImmediate(response) {
  return { type: SUBMIT_RESPONSE_IMMEDIATE, response}
}

export function clearResponses() {
  return { type: CLEAR_RESPONSES}
}

export function submitResponseAnon(response) {
  return { type: SUBMIT_RESPONSE_ANON, response}
}

export function clearResponsesAnon() {
  return { type: CLEAR_RESPONSES_ANON}
}

export function nextQuestion() {
  return { type: NEXT_QUESTION}
}

export function loadData(data) {
  return { type: LOAD_DATA, data}
}

export function clearData(data) {
  return { type: CLEAR_DATA, data}
}

export function exitToHome() {
  return { type: EXIT}
}

export function updateName(data) {
  return { type: UPDATE_NAME, data}
}

export function startQuestion() {
  return {type: START_QUESTION}
}

export function updateCurrentQuestion(data) {
  return { type: UPDATE_CURRENT_QUESTION, data}
}

export function resumePreviousSession(data) {
  return { type: RESUME_PREVIOUS_SESSION, data}
}

export function setCurrentQuestion(data) {
  return { type: SET_CURRENT_QUESTION, data };
}
