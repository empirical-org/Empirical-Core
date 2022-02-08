export interface Constants {
  FIREBASE: string;

	// uI FEEDBACK ACTIONS
  DISPLAY_ERROR: string;
  DISPLAY_MESSAGE: string;
  DISMISS_FEEDBACK: string;
  CLEAR_DISPLAY_MESSAGE_AND_ERROR: string;

	// aUTH ACTIONS
  ATTEMPTING_LOGIN: string;
  LOGIN_USER: string;
  LOGOUT: string;

	// aUTH STATES
  LOGGED_IN: string;
  ANONYMOUS: string;
  AWAITING_AUTH_RESPONSE: string;

	// cONCEPT ACTIONS
  RECEIVE_CONCEPTS_DATA: string;
  AWAIT_NEW_CONCEPT_RESPONSE: string;
  RECEIVE_NEW_CONCEPT_RESPONSE: string;
  START_CONCEPT_EDIT: string;
  FINISH_CONCEPT_EDIT: string;
  SUBMIT_CONCEPT_EDIT: string;
  TOGGLE_NEW_CONCEPT_MODAL: string;

	// cONCEPT STATES
  EDITING_CONCEPT: string;
  SUBMITTING_CONCEPT: string;

	// lESSON ACTIONS
  RECEIVE_LESSONS_DATA: string;
  AWAIT_NEW_LESSON_RESPONSE: string;
  RECEIVE_NEW_LESSON_RESPONSE: string;
  START_LESSON_EDIT: string;
  FINISH_LESSON_EDIT: string;
  SUBMIT_LESSON_EDIT: string;
  TOGGLE_NEW_LESSON_MODAL: string;

  // CLASSROOM_LESSON ACTIONS
  RECEIVE_CLASSROOM_LESSONS_DATA: string;
  RECEIVE_CLASSROOM_LESSON_DATA: string;
  RECEIVE_CLASSROOM_LESSONS_REVIEW_DATA: string;
  NO_LESSON_ID: string;
  NO_LESSONS: string;
  SET_LESSON_ID: string;
  CLEAR_CLASSROOM_LESSON_DATA: string;

	// lESSON STATES
  EDITING_LESSON: string;
  SUBMITTING_LESSON: string;

	// QUESTION ACTIONS
  RECEIVE_QUESTIONS_DATA: string;
  AWAIT_NEW_QUESTION_RESPONSE: string;
  RECEIVE_NEW_QUESTION_RESPONSE: string;
  START_QUESTION_EDIT: string;
  FINISH_QUESTION_EDIT: string;
  SUBMIT_QUESTION_EDIT: string;
  TOGGLE_NEW_QUESTION_MODAL: string;
  SHOULD_RELOAD_RESPONSES: string;
  CLEAR_QUESTION_STATE: string;
  UPDATE_SEARCHED_RESPONSES: string;
  SET_RESPONSE_PAGE_NUMBER: string;
  SET_RESPONSE_STRING_FILTER: string;
  INCREMENT_REQUEST_COUNT: string;
  SET_SUGGESTED_SEQUENCES: string;
  SET_USED_SEQUENCES: string;
  SET_COVERED_SEQUENCES: string;

	// QUESTION STATES
  EDITING_QUESTION: string;
  SUBMITTING_QUESTION: string;

  // FILL IN BLANK QUESTION ACTIONS
  RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA: string;
  AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE: string;
  RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE: string;
  START_FILL_IN_BLANK_QUESTION_EDIT: string;
  FINISH_FILL_IN_BLANK_QUESTION_EDIT: string;
  SUBMIT_FILL_IN_BLANK_QUESTION_EDIT: string;
  TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL: string;

	// FILL IN BLANK QUESTION STATES
  EDITING_FILL_IN_BLANK_QUESTION: string;
  SUBMITTING_FILL_IN_BLANK_QUESTION: string;

	// QUESTION RESPONSE STATES
  START_RESPONSE_EDIT: string;
  CANCEL_RESPONSE_EDIT: string;
  FINISH_RESPONSE_EDIT: string;
  SUBMIT_RESPONSE_EDIT: string;
  SUBMITTING_RESPONSE: string;
  START_CHILD_RESPONSE_VIEW: string;
  CANCEL_CHILD_RESPONSE_VIEW: string;
  START_FROM_RESPONSE_VIEW: string;
  CANCEL_FROM_RESPONSE_VIEW: string;
  START_TO_RESPONSE_VIEW: string;
  CANCEL_TO_RESPONSE_VIEW: string;

	// dIAGNOSTIC QUESTION ACTIONS
  RECEIVE_DIAGNOSTIC_QUESTIONS_DATA: string;
  AWAIT_NEW_DIAGNOSTIC_QUESTION_RESPONSE: string;
  RECEIVE_NEW_DIAGNOSTIC_QUESTION_RESPONSE: string;
  START_DIAGNOSTIC_QUESTION_EDIT: string;
  FINISH_DIAGNOSTIC_QUESTION_EDIT: string;
  SUBMIT_DIAGNOSTIC_QUESTION_EDIT: string;
  TOGGLE_NEW_DIAGNOSTIC_QUESTION_MODAL: string;

	// dIAGNOSTIC_QUESTION STATES
  EDITING_DIAGNOSTIC_QUESTION: string;
  SUBMITTING_DIAGNOSTIC_QUESTION: string;

	// dIAGNOSTIC QUESTION RESPONSE STATES
  START_DIAGNOSTIC_RESPONSE_EDIT: string;
  CANCEL_DIAGNOSTIC_RESPONSE_EDIT: string;
  FINISH_DIAGNOSTIC_RESPONSE_EDIT: string;
  SUBMIT_DIAGNOSTIC_RESPONSE_EDIT: string;
  SUBMITTING_DIAGNOSTIC_RESPONSE: string;
  START_CHILD_DIAGNOSTIC_RESPONSE_VIEW: string;
  CANCEL_CHILD_DIAGNOSTIC_RESPONSE_VIEW: string;
  START_FROM_DIAGNOSTIC_RESPONSE_VIEW: string;
  CANCEL_FROM_DIAGNOSTIC_RESPONSE_VIEW: string;
  START_TO_DIAGNOSTIC_RESPONSE_VIEW: string;
  CANCEL_TO_DIAGNOSTIC_RESPONSE_VIEW: string;

	// rESPONSE ACTIONS:
  TOGGLE_EXPAND_SINGLE_RESPONSE: string;
  COLLAPSE_ALL_RESPONSES: string;
  EXPAND_ALL_RESPONSES: string;
  TOGGLE_STATUS_FIELD: string;
  TOGGLE_RESPONSE_SORT: string;
  RESET_ALL_FIELDS: string;
  TOGGLE_MASS_SELECTION: string;
  DESELECT_ALL_FIELDS: string;

  // mASS EDIT RESPONSE ACTIONS
  ADD_RESPONSE_TO_MASS_EDIT_ARRAY: string;
  REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY: string;
  CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY: string;

  NUMBERS_AS_WORDS: Array<string>;

  INSTRUCTIONS: any;

	// cONCEPTS FEEDBACK ACTIONS
  RECEIVE_CONCEPTS_FEEDBACK_DATA: string;
  AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE: string;
  RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE: string;
  START_CONCEPTS_FEEDBACK_EDIT: string;
  FINISH_CONCEPTS_FEEDBACK_EDIT: string;
  SUBMIT_CONCEPTS_FEEDBACK_EDIT: string;
  TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL: string;

	// iTEM LEVEL ACTIONS
  RECEIVE_ITEM_LEVELS_DATA: string;
  AWAIT_NEW_ITEM_LEVEL_RESPONSE: string;
  RECEIVE_NEW_ITEM_LEVEL_RESPONSE: string;
  START_ITEM_LEVEL_EDIT: string;
  FINISH_ITEM_LEVEL_EDIT: string;
  SUBMIT_ITEM_LEVEL_EDIT: string;
  TOGGLE_NEW_ITEM_LEVEL_MODAL: string;

	// iTEM LEVEL STATES
  EDITING_ITEM_LEVEL: string;
  SUBMITTING_ITEM_LEVEL: string;

	// sENTENCE_FRAGMENT ACTIONS
  RECEIVE_SENTENCE_FRAGMENTS_DATA: string;
  AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE: string;
  RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE: string;
  START_SENTENCE_FRAGMENT_EDIT: string;
  FINISH_SENTENCE_FRAGMENT_EDIT: string;
  SUBMIT_SENTENCE_FRAGMENT_EDIT: string;
  TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL: string;

	// sENTENCE_FRAGMENT STATES
  EDITING_SENTENCE_FRAGMENT: string;
  SUBMITTING_SENTENCE_FRAGMENT: string;

	// sESSION ACTIONS
  UPDATE_SESSION_DATA: string;
  DELETE_SESSION_DATA: string;
  DELETE_ALL_SESSION_DATA: string;

	// rESPONSE ACTIONS
  UPDATE_RESPONSE_STATUS: string;
  UPDATE_RESPONSE_DATA: string;
  DELETE_RESPONSE_STATUS: string;

  // score Analysis ACTIONS
  RECEIVE_SCORE_ANALYSIS_DATA: string;

  // CLASSROOM SESSION ACTIONS
  UPDATE_CLASSROOM_SESSION_DATA: string;
  UPDATE_CLASSROOM_SESSION_WITHOUT_CURRENT_SLIDE: string;
  UPDATE_SLIDE_IN_STORE: string;
  TOGGLE_HEADERS: string;
  NO_CLASSROOM_ACTIVITY: string;
  NO_STUDENT_ID: string;
  HIDE_SIGNUP_MODAL: string;
  SHOW_SIGNUP_MODAL: string;

  // CUSTOMIZE ACTIONS
  SET_USER_ID: string;
  SET_COTEACHERS: string;
  SET_EDITION_METADATA: string;
  SET_EDITION_QUESTIONS: string;
  SET_WORKING_EDITION_QUESTIONS: string;
  SET_WORKING_EDITION_METADATA: string;
  SET_INCOMPLETE_QUESTIONS: string;
}


const constants: Constants =  {
  // mISC
  FIREBASE: 'https://quillconnectstaging.firebaseio.com/v2/',

  // uI FEEDBACK ACTIONS
  DISPLAY_ERROR: 'DISPLAY_ERROR',
  DISPLAY_MESSAGE: 'DISPLAY_MESSAGE',
  DISMISS_FEEDBACK: 'DISMISS_FEEDBACK',
  CLEAR_DISPLAY_MESSAGE_AND_ERROR: 'CLEAR_DISPLAY_MESSAGE_AND_ERROR',

  // aUTH ACTIONS
  ATTEMPTING_LOGIN: 'ATTEMPTING_LOGIN',
  LOGIN_USER: 'LOGIN_USER',
  LOGOUT: 'LOGOUT',

  // aUTH STATES
  LOGGED_IN: 'LOGGED_IN',
  ANONYMOUS: 'ANONYMOUS',
  AWAITING_AUTH_RESPONSE: 'AWAITING_AUTH_RESPONSE',

  // cONCEPT ACTIONS
  RECEIVE_CONCEPTS_DATA: 'RECEIVE_CONCEPTS_DATA',
  AWAIT_NEW_CONCEPT_RESPONSE: 'AWAIT_NEW_CONCEPT_RESPONSE',
  RECEIVE_NEW_CONCEPT_RESPONSE: 'RECEIVE_NEW_CONCEPT_RESPONSE',
  START_CONCEPT_EDIT: 'START_CONCEPT_EDIT',
  FINISH_CONCEPT_EDIT: 'FINISH_CONCEPT_EDIT',
  SUBMIT_CONCEPT_EDIT: 'SUBMIT_CONCEPT_EDIT',
  TOGGLE_NEW_CONCEPT_MODAL: 'TOGGLE_NEW_CONCEPT_MODAL',

  // cONCEPT STATES
  EDITING_CONCEPT: 'EDITING_CONCEPT',
  SUBMITTING_CONCEPT: 'SUBMITTING_CONCEPT',

  // lESSON ACTIONS
  RECEIVE_LESSONS_DATA: 'RECEIVE_LESSONS_DATA',
  AWAIT_NEW_LESSON_RESPONSE: 'AWAIT_NEW_LESSON_RESPONSE',
  RECEIVE_NEW_LESSON_RESPONSE: 'RECEIVE_NEW_LESSON_RESPONSE',
  START_LESSON_EDIT: 'START_LESSON_EDIT',
  FINISH_LESSON_EDIT: 'FINISH_LESSON_EDIT',
  SUBMIT_LESSON_EDIT: 'SUBMIT_LESSON_EDIT',
  TOGGLE_NEW_LESSON_MODAL: 'TOGGLE_NEW_LESSON_MODAL',

  // CLASSROOM_LESSON ACTIONS
  RECEIVE_CLASSROOM_LESSONS_DATA: 'RECEIVE_CLASSROOM_LESSONS_DATA',
  RECEIVE_CLASSROOM_LESSON_DATA: 'RECEIVE_CLASSROOM_LESSON_DATA',
  RECEIVE_CLASSROOM_LESSONS_REVIEW_DATA: 'RECEIVE_CLASSROOM_LESSONS_REVIEW_DATA',
  NO_LESSON_ID: 'NO_LESSON_ID',
  NO_LESSONS: 'NO_LESSONS',
  SET_LESSON_ID: 'SET_LESSON_ID',
  CLEAR_CLASSROOM_LESSON_DATA: 'CLEAR_CLASSROOM_LESSON_DATA',

  // lESSON STATES
  EDITING_LESSON: 'EDITING_LESSON',
  SUBMITTING_LESSON: 'SUBMITTING_LESSON',

  // QUESTION ACTIONS
  RECEIVE_QUESTIONS_DATA: 'RECEIVE_QUESTIONS_DATA',
  AWAIT_NEW_QUESTION_RESPONSE: 'AWAIT_NEW_QUESTION_RESPONSE',
  RECEIVE_NEW_QUESTION_RESPONSE: 'RECEIVE_NEW_QUESTION_RESPONSE',
  START_QUESTION_EDIT: 'START_QUESTION_EDIT',
  FINISH_QUESTION_EDIT: 'FINISH_QUESTION_EDIT',
  SUBMIT_QUESTION_EDIT: 'SUBMIT_QUESTION_EDIT',
  TOGGLE_NEW_QUESTION_MODAL: 'TOGGLE_NEW_QUESTION_MODAL',
  SHOULD_RELOAD_RESPONSES: 'SHOULD_RELOAD_RESPONSES',
  CLEAR_QUESTION_STATE: 'CLEAR_QUESTION_STATE',
  UPDATE_SEARCHED_RESPONSES: 'UPDATE_SEARCHED_RESPONSES',
  SET_RESPONSE_PAGE_NUMBER: 'SET_RESPONSE_PAGE_NUMBER',
  SET_RESPONSE_STRING_FILTER: 'SET_RESPONSE_STRING_FILTER',
  INCREMENT_REQUEST_COUNT: 'INCREMENT_REQUEST_COUNT',
  SET_SUGGESTED_SEQUENCES: 'SET_SUGGESTED_SEQUENCES',
  SET_USED_SEQUENCES: 'SET_USED_SEQUENCES',
  SET_COVERED_SEQUENCES: 'SET_COVERED_SEQUENCES',

  // QUESTION STATES
  EDITING_QUESTION: 'EDITING_QUESTION',
  SUBMITTING_QUESTION: 'SUBMITTING_QUESTION',

  // FILL IN BLANK QUESTION ACTIONS
  RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA: 'RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA',
  AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE: 'AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE',
  RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE: 'RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE',
  START_FILL_IN_BLANK_QUESTION_EDIT: 'START_FILL_IN_BLANK_QUESTION_EDIT',
  FINISH_FILL_IN_BLANK_QUESTION_EDIT: 'FINISH_FILL_IN_BLANK_QUESTION_EDIT',
  SUBMIT_FILL_IN_BLANK_QUESTION_EDIT: 'SUBMIT_FILL_IN_BLANK_QUESTION_EDIT',
  TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL: 'TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL',

  // FILL IN BLANK QUESTION STATES
  EDITING_FILL_IN_BLANK_QUESTION: 'EDITING_FILL_IN_BLANK_QUESTION',
  SUBMITTING_FILL_IN_BLANK_QUESTION: 'SUBMITTING_FILL_IN_BLANK_QUESTION',

  // QUESTION RESPONSE STATES
  START_RESPONSE_EDIT: 'START_RESPONSE_EDIT',
  CANCEL_RESPONSE_EDIT: 'CANCEL_RESPONSE_EDIT',
  FINISH_RESPONSE_EDIT: 'FINISH_RESPONSE_EDIT',
  SUBMIT_RESPONSE_EDIT: 'SUBMIT_RESPONSE_EDIT',
  SUBMITTING_RESPONSE: 'SUBMITTING_RESPONSE',
  START_CHILD_RESPONSE_VIEW: 'START_CHILD_RESPONSE_VIEW',
  CANCEL_CHILD_RESPONSE_VIEW: 'CANCEL_CHILD_RESPONSE_VIEW',
  START_FROM_RESPONSE_VIEW: 'START_FROM_RESPONSE_VIEW',
  CANCEL_FROM_RESPONSE_VIEW: 'CANCEL_FROM_RESPONSE_VIEW',
  START_TO_RESPONSE_VIEW: 'START_TO_RESPONSE_VIEW',
  CANCEL_TO_RESPONSE_VIEW: 'CANCEL_TO_RESPONSE_VIEW',

  // dIAGNOSTIC QUESTION ACTIONS
  RECEIVE_DIAGNOSTIC_QUESTIONS_DATA: 'RECEIVE_DIAGNOSTIC_QUESTIONS_DATA',
  AWAIT_NEW_DIAGNOSTIC_QUESTION_RESPONSE: 'AWAIT_NEW_DIAGNOSTIC_QUESTION_RESPONSE',
  RECEIVE_NEW_DIAGNOSTIC_QUESTION_RESPONSE: 'RECEIVE_NEW_DIAGNOSTIC_QUESTION_RESPONSE',
  START_DIAGNOSTIC_QUESTION_EDIT: 'START_DIAGNOSTIC_QUESTION_EDIT',
  FINISH_DIAGNOSTIC_QUESTION_EDIT: 'FINISH_DIAGNOSTIC_QUESTION_EDIT',
  SUBMIT_DIAGNOSTIC_QUESTION_EDIT: 'SUBMIT_DIAGNOSTIC_QUESTION_EDIT',
  TOGGLE_NEW_DIAGNOSTIC_QUESTION_MODAL: 'TOGGLE_NEW_DIAGNOSTIC_QUESTION_MODAL',

  // dIAGNOSTIC_QUESTION STATES
  EDITING_DIAGNOSTIC_QUESTION: 'EDITING_DIAGNOSTIC_QUESTION',
  SUBMITTING_DIAGNOSTIC_QUESTION: 'SUBMITTING_DIAGNOSTIC_QUESTION',

  // dIAGNOSTIC QUESTION RESPONSE STATES
  START_DIAGNOSTIC_RESPONSE_EDIT: 'START_DIAGNOSTIC_RESPONSE_EDIT',
  CANCEL_DIAGNOSTIC_RESPONSE_EDIT: 'CANCEL_DIAGNOSTIC_RESPONSE_EDIT',
  FINISH_DIAGNOSTIC_RESPONSE_EDIT: 'FINISH_DIAGNOSTIC_RESPONSE_EDIT',
  SUBMIT_DIAGNOSTIC_RESPONSE_EDIT: 'SUBMIT_DIAGNOSTIC_RESPONSE_EDIT',
  SUBMITTING_DIAGNOSTIC_RESPONSE: 'SUBMITTING_DIAGNOSTIC_RESPONSE',
  START_CHILD_DIAGNOSTIC_RESPONSE_VIEW: 'START_CHILD_DIAGNOSTIC_RESPONSE_VIEW',
  CANCEL_CHILD_DIAGNOSTIC_RESPONSE_VIEW: 'CANCEL_CHILD_DIAGNOSTIC_RESPONSE_VIEW',
  START_FROM_DIAGNOSTIC_RESPONSE_VIEW: 'START_FROM_DIAGNOSTIC_RESPONSE_VIEW',
  CANCEL_FROM_DIAGNOSTIC_RESPONSE_VIEW: 'CANCEL_FROM_DIAGNOSTIC_RESPONSE_VIEW',
  START_TO_DIAGNOSTIC_RESPONSE_VIEW: 'START_TO_DIAGNOSTIC_RESPONSE_VIEW',
  CANCEL_TO_DIAGNOSTIC_RESPONSE_VIEW: 'CANCEL_TO_DIAGNOSTIC_RESPONSE_VIEW',

  // rESPONSE ACTIONS:
  TOGGLE_EXPAND_SINGLE_RESPONSE: 'TOGGLE_EXPAND_SINGLE_RESPONSE',
  COLLAPSE_ALL_RESPONSES: 'COLLAPSE_ALL_RESPONSES',
  EXPAND_ALL_RESPONSES: 'EXPAND_ALL_RESPONSES',
  TOGGLE_STATUS_FIELD: 'TOGGLE_STATUS_FIELD',
  TOGGLE_RESPONSE_SORT: 'TOGGLE_RESPONSE_SORT',
  RESET_ALL_FIELDS: 'RESET_ALL_FIELDS',
  TOGGLE_MASS_SELECTION: 'TOGGLE_MASS_SELECTION',
  DESELECT_ALL_FIELDS: 'DESELECT_ALL_FIELDS',

  // mASS EDIT RESPONSE ACTIONS
  ADD_RESPONSE_TO_MASS_EDIT_ARRAY: 'ADD_RESPONSE_TO_MASS_EDIT_ARRAY',
  REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY: 'REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY',
  CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY: 'CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY',

  NUMBERS_AS_WORDS: [
    'zero', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
  ],

  INSTRUCTIONS: {
    sentenceFragments: 'Add/change as few words as you can to change this fragment into a sentence.',
  },

  // cONCEPTS FEEDBACK ACTIONS
  RECEIVE_CONCEPTS_FEEDBACK_DATA: 'RECEIVE_CONCEPTS_FEEDBACK_DATA',
  AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE: 'AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE',
  RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE: 'RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE',
  START_CONCEPTS_FEEDBACK_EDIT: 'START_CONCEPTS_FEEDBACK_EDIT',
  FINISH_CONCEPTS_FEEDBACK_EDIT: 'FINISH_CONCEPTS_FEEDBACK_EDIT',
  SUBMIT_CONCEPTS_FEEDBACK_EDIT: 'SUBMIT_CONCEPTS_FEEDBACK_EDIT',
  TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL: 'TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL',

  // iTEM LEVEL ACTIONS
  RECEIVE_ITEM_LEVELS_DATA: 'RECEIVE_ITEM_LEVELS_DATA',
  AWAIT_NEW_ITEM_LEVEL_RESPONSE: 'AWAIT_NEW_ITEM_LEVEL_RESPONSE',
  RECEIVE_NEW_ITEM_LEVEL_RESPONSE: 'RECEIVE_NEW_ITEM_LEVEL_RESPONSE',
  START_ITEM_LEVEL_EDIT: 'START_ITEM_LEVEL_EDIT',
  FINISH_ITEM_LEVEL_EDIT: 'FINISH_ITEM_LEVEL_EDIT',
  SUBMIT_ITEM_LEVEL_EDIT: 'SUBMIT_ITEM_LEVEL_EDIT',
  TOGGLE_NEW_ITEM_LEVEL_MODAL: 'TOGGLE_NEW_ITEM_LEVEL_MODAL',

  // iTEM LEVEL STATES
  EDITING_ITEM_LEVEL: 'EDITING_ITEM_LEVEL',
  SUBMITTING_ITEM_LEVEL: 'SUBMITTING_ITEM_LEVEL',

  // sENTENCE_FRAGMENT ACTIONS
  RECEIVE_SENTENCE_FRAGMENTS_DATA: 'RECEIVE_SENTENCE_FRAGMENTS_DATA',
  AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE: 'AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE',
  RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE: 'RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE',
  START_SENTENCE_FRAGMENT_EDIT: 'START_SENTENCE_FRAGMENT_EDIT',
  FINISH_SENTENCE_FRAGMENT_EDIT: 'FINISH_SENTENCE_FRAGMENT_EDIT',
  SUBMIT_SENTENCE_FRAGMENT_EDIT: 'SUBMIT_SENTENCE_FRAGMENT_EDIT',
  TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL: 'TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL',

  // sENTENCE_FRAGMENT STATES
  EDITING_SENTENCE_FRAGMENT: 'EDITING_SENTENCE_FRAGMENT',
  SUBMITTING_SENTENCE_FRAGMENT: 'SUBMITTING_SENTENCE_FRAGMENT',

  // sESSION ACTIONS
  UPDATE_SESSION_DATA: 'UPDATE_SESSION_DATA',
  DELETE_SESSION_DATA: 'DELETE_SESSION_DATA',
  DELETE_ALL_SESSION_DATA: 'DELETE_ALL_SESSION_DATA',

  // rESPONSE ACTIONS
  UPDATE_RESPONSE_STATUS: 'UPDATE_RESPONSE_STATUS',
  UPDATE_RESPONSE_DATA: 'UPDATE_RESPONSE_DATA',
  DELETE_RESPONSE_STATUS: 'DELETE_RESPONSE_STATUS',

  // score Analysis ACTIONS
  RECEIVE_SCORE_ANALYSIS_DATA: 'RECEIVE_SCORE_ANALYSIS_DATA',

  // CLASSROOM SESSION ACTIONS
  UPDATE_CLASSROOM_SESSION_DATA: 'UPDATE_CLASSROOM_SESSION_DATA',
  UPDATE_CLASSROOM_SESSION_WITHOUT_CURRENT_SLIDE: 'UPDATE_CLASSROOM_SESSION_WITHOUT_CURRENT_SLIDE',
  UPDATE_SLIDE_IN_STORE: 'UPDATE_SLIDE_IN_STORE',
  TOGGLE_HEADERS: 'TOGGLE_HEADERS',
  NO_CLASSROOM_ACTIVITY: 'NO_CLASSROOM_ACTIVITY',
  NO_STUDENT_ID: 'NO_STUDENT_ID',
  HIDE_SIGNUP_MODAL: 'HIDE_SIGNUP_MODAL',
  SHOW_SIGNUP_MODAL: 'SHOW_SIGNUP_MODAL',

  // CUSTOMIZE ACTIONS
  SET_USER_ID: 'SET_USER_ID',
  SET_COTEACHERS: 'SET_COTEACHERS',
  SET_EDITION_METADATA: 'SET_EDITION_METADATA',
  SET_EDITION_QUESTIONS: 'SET_EDITION_QUESTIONS',
  SET_WORKING_EDITION_QUESTIONS: 'SET_WORKING_EDITION_QUESTIONS',
  SET_WORKING_EDITION_METADATA: 'SET_WORKING_EDITION_METADATA',
  SET_INCOMPLETE_QUESTIONS: 'SET_INCOMPLETE_QUESTIONS',
};

export default constants;
