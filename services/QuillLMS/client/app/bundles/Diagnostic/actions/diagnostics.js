export const SUBMIT_DIAGNOSTIC_RESPONSE = 'SUBMIT_DIAGNOSTIC_RESPONSE';
export const SUBMIT_DIAGNOSTIC_RESPONSE_ANON = 'SUBMIT_DIAGNOSTIC_RESPONSE_ANON';
export const NEXT_DIAGNOSTIC_QUESTION = 'NEXT_DIAGNOSTIC_QUESTION';
export const LOAD_DIAGNOSTIC_DATA = 'LOAD_DIAGNOSTIC_DATA';
export const CLEAR_DIAGNOSTIC_DATA = 'CLEAR_DIAGNOSTIC_DATA';
export const EXIT_DIAGNOSTIC = 'EXIT_DIAGNOSTIC';
export const CLEAR_DIAGNOSTIC_RESPONSES = 'CLEAR_DIAGNOSTIC_RESPONSES';
export const CLEAR_DIAGNOSTIC_RESPONSES_ANON = 'CLEAR_DIAGNOSTIC_RESPONSES_ANON';
export const UPDATE_DIAGNOSTIC_NAME = 'UPDATE_DIAGNOSTIC_NAME';
export const START_DIAGNOSTIC_QUESTION = 'START_DIAGNOSTIC_QUESTION';
export const UPDATE_DIAGNOSTIC_CURRENT_QUESTION = 'UPDATE_DIAGNOSTIC_CURRENT_QUESTION';
export const RESUME_PREVIOUS_DIAGNOSTIC_SESSION = 'RESUME_PREVIOUS_DIAGNOSTIC_SESSION';
export const UPDATE_DIAGNOSTIC_LANGUAGE = 'UPDATE_DIAGNOSTIC_LANGUAGE';
export const SET_DIAGNOSTIC_ID = 'SET_DIAGNOSTIC_ID'
export const SET_CURRENT_QUESTION = 'SET_CURRENT_QUESTION'

export const SubmitActions = {
  SUBMIT_DIAGNOSTIC_RESPONSE,
  SUBMIT_DIAGNOSTIC_RESPONSE_ANON,
  NEXT_DIAGNOSTIC_QUESTION,
  LOAD_DIAGNOSTIC_DATA,
  CLEAR_DIAGNOSTIC_DATA,
  EXIT_DIAGNOSTIC,
  CLEAR_DIAGNOSTIC_RESPONSES,
  CLEAR_DIAGNOSTIC_RESPONSES_ANON,
  UPDATE_DIAGNOSTIC_NAME,
  START_DIAGNOSTIC_QUESTION,
  UPDATE_DIAGNOSTIC_CURRENT_QUESTION,
  RESUME_PREVIOUS_DIAGNOSTIC_SESSION,
  UPDATE_DIAGNOSTIC_LANGUAGE,
  SET_DIAGNOSTIC_ID,
  SET_CURRENT_QUESTION
};

/*
 * action creators
 */

export function submitResponse(response) {
  return { type: SUBMIT_DIAGNOSTIC_RESPONSE, response, };
}

export function clearResponses() {
  return { type: CLEAR_DIAGNOSTIC_RESPONSES, };
}

export function submitResponseAnon(response) {
  return { type: SUBMIT_DIAGNOSTIC_RESPONSE_ANON, response, };
}

export function clearResponsesAnon() {
  return { type: CLEAR_DIAGNOSTIC_RESPONSES_ANON, };
}

export function nextQuestion() {
  return { type: NEXT_DIAGNOSTIC_QUESTION, };
}

export function loadData(data) {
  return { type: LOAD_DIAGNOSTIC_DATA, data, };
}

export function clearData(data) {
  return { type: CLEAR_DIAGNOSTIC_DATA, data, };
}

export function exitToHome() {
  return { type: EXIT_DIAGNOSTIC, };
}

export function updateName(data) {
  return { type: UPDATE_DIAGNOSTIC_NAME, data, };
}

export function updateLanguage(data) {
  return { type: UPDATE_DIAGNOSTIC_LANGUAGE, data, };
}

export function startQuestion() {
  return { type: START_DIAGNOSTIC_QUESTION, };
}

export function updateCurrentQuestion(data) {
  return { type: UPDATE_DIAGNOSTIC_CURRENT_QUESTION, data, };
}

export function resumePreviousDiagnosticSession(data) {
  return { type: RESUME_PREVIOUS_DIAGNOSTIC_SESSION, data, };
}

export function setDiagnosticID(data) {
  return { type: SET_DIAGNOSTIC_ID, data };
}

export function setCurrentQuestion(data) {
  return { type: SET_CURRENT_QUESTION, data };
}
