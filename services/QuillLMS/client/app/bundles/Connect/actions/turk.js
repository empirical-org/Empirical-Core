export const SUBMIT_TURK_RESPONSE = 'SUBMIT_TURK_RESPONSE';
export const SUBMIT_TURK_RESPONSE_ANON = 'SUBMIT_TURK_RESPONSE_ANON';
export const NEXT_TURK_QUESTION = 'NEXT_TURK_QUESTION';
export const NEXT_TURK_QUESTION_WITHOUT_SAVING = 'NEXT_TURK_QUESTION_WITHOUT_SAVING';
export const LOAD_TURK_DATA = 'LOAD_TURK_DATA';
export const CLEAR_TURK_DATA = 'CLEAR_TURK_DATA';
export const EXIT_TURK = 'EXIT_TURK';
export const CLEAR_TURK_RESPONSES = 'CLEAR_TURK_RESPONSES';
export const CLEAR_TURK_RESPONSES_ANON = 'CLEAR_TURK_RESPONSES_ANON';
export const UPDATE_TURK_NAME = 'UPDATE_TURK_NAME';
export const START_TURK_QUESTION = 'START_TURK_QUESTION';
export const UPDATE_TURK_CURRENT_QUESTION = 'UPDATE_TURK_CURRENT_QUESTION';
export const RESUME_PREVIOUS_TURK_SESSION = 'RESUME_PREVIOUS_TURK_SESSION';
export const UPDATE_TURK_LANGUAGE = 'UPDATE_TURK_LANGUAGE';

export const SubmitActions = {
  SUBMIT_TURK_RESPONSE,
  SUBMIT_TURK_RESPONSE_ANON,
  NEXT_TURK_QUESTION,
  NEXT_TURK_QUESTION_WITHOUT_SAVING,
  LOAD_TURK_DATA,
  CLEAR_TURK_DATA,
  EXIT_TURK,
  CLEAR_TURK_RESPONSES,
  CLEAR_TURK_RESPONSES_ANON,
  UPDATE_TURK_NAME,
  START_TURK_QUESTION,
  UPDATE_TURK_CURRENT_QUESTION,
  RESUME_PREVIOUS_TURK_SESSION,
  UPDATE_TURK_LANGUAGE,
};

/*
 * action creators
 */

export function submitResponse(response) {
  return { type: SUBMIT_TURK_RESPONSE, response, };
}

export function clearResponses() {
  return { type: CLEAR_TURK_RESPONSES, };
}

export function submitResponseAnon(response) {
  return { type: SUBMIT_TURK_RESPONSE_ANON, response, };
}

export function clearResponsesAnon() {
  return { type: CLEAR_TURK_RESPONSES_ANON, };
}

export function nextQuestion() {
  return { type: NEXT_TURK_QUESTION, };
}

export function nextQuestionWithoutSaving() {
  return { type: NEXT_TURK_QUESTION_WITHOUT_SAVING, };
}

export function loadData(data) {
  return { type: LOAD_TURK_DATA, data, };
}

export function clearData(data) {
  return { type: CLEAR_TURK_DATA, data, };
}

export function exitToHome() {
  return { type: EXIT_TURK, };
}

export function updateName(data) {
  return { type: UPDATE_TURK_NAME, data, };
}

export function updateLanguage(data) {
  return { type: UPDATE_TURK_LANGUAGE, data, };
}

export function startQuestion() {
  return { type: START_TURK_QUESTION, };
}

export function updateCurrentQuestion(data) {
  return { type: UPDATE_TURK_CURRENT_QUESTION, data, };
}

export function resumePreviousTurkSession(data) {
  return { type: RESUME_PREVIOUS_TURK_SESSION, data, };
}
