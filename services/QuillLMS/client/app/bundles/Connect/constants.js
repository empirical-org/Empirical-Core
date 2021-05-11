export default {
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
  SET_LESSON_FLAG: 'SET_LESSON_FLAG',

  // ACTIVITY HEALTH ACTIONS
  SET_ACTIVITY_HEALTH_FLAG: 'SET_ACTIVITY_HEALTH_FLAG',

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
  RECEIVE_QUESTION_DATA: 'RECEIVE_QUESTION_DATA',
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
  SET_USED_SEQUENCES: 'SET_USED_SEQUENCES',

  // QUESTION STATES
  EDITING_QUESTION: 'EDITING_QUESTION',
  SUBMITTING_QUESTION: 'SUBMITTING_QUESTION',

  // FILL IN BLANK QUESTION ACTIONS
  RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA: 'RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA',
  RECEIVE_FILL_IN_BLANK_QUESTION_DATA: 'RECEIVE_FILL_IN_BLANK_QUESTION_DATA',
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
  START_TURK_QUESTION_EDIT: 'START_TURK_QUESTION_EDIT',
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
  SUBMIT_TURK_RESPONSE_EDIT: 'SUBMIT_TURK_RESPONSE_EDIT',
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
  TOGGLE_EXCLUDE_MISSPELLINGS: 'TOGGLE_EXCLUDE_MISSPELLINGS',
  RESET_ALL_FIELDS: 'RESET_ALL_FIELDS',
  TOGGLE_MASS_SELECTION: 'TOGGLE_MASS_SELECTION',
  DESELECT_ALL_FIELDS: 'DESELECT_ALL_FIELDS',

  // mASS EDIT RESPONSE ACTIONS
  ADD_RESPONSE_TO_MASS_EDIT_ARRAY: 'ADD_RESPONSE_TO_MASS_EDIT_ARRAY',
  ADD_RESPONSES_TO_MASS_EDIT_ARRAY: 'ADD_RESPONSES_TO_MASS_EDIT_ARRAY',
  REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY: 'REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY',
  REMOVE_RESPONSES_FROM_MASS_EDIT_ARRAY: 'REMOVE_RESPONSES_FROM_MASS_EDIT_ARRAY',
  CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY: 'CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY',

  FEEDBACK_STRINGS: {
    punctuationError: 'There may be an error. How could you update the punctuation?',
    punctuationAndCaseError: 'There may be an error. How could you update the punctuation and capitalization?',
    typingError: 'Try again. There may be a spelling mistake.',
    caseError: 'Proofread your work. There may be a capitalization error.',
    minLengthError: 'Revise your work. Do you have all of the information from the prompt?',
    maxLengthError: 'Revise your work. How could your response be shorter and more concise?',
    modifiedWordError: 'Revise your work. You may have mixed up or misspelled a word.',
    additionalWordError: 'Revise your work. You may have added an extra word.',
    missingWordError: 'Revise your work. You may have left out an important word.',
    whitespaceError: 'There may be an error. You may have forgotten a space between two words.',
    flexibleModifiedWordError: 'Revise your work. You may have mixed up a word.',
    flexibleAdditionalWordError: 'Revise your work. You may have added an extra word.',
    flexibleMissingWordError: 'Revise your work. You may have left out an important word.',
  },

  NUMBERS_AS_WORDS: [
    'zero', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
  ],

  INSTRUCTIONS: {
    sentenceFragments: 'Add/change as few words as you can to change this fragment into a sentence.',
  },

  ERROR_TYPES: [
    'typingError',
    'caseError',
    'punctuationError',
    'punctuationAndCaseError',
    'minLengthError',
    'maxLengthError',
    'flexibleModifiedWordError',
    'flexibleAdditionalWordError',
    'flexibleMissingWordError',
    'modifiedWordError',
    'additionalWordError',
    'missingWordError',
    'whitespaceError',
    'requiredWordsError',
    'tooShortError',
    'tooLongError'
  ],

  ERROR_AUTHORS: [
    'Focus Point Hint',
    'Incorrect Sequence Hint',
    'Capitalization Hint',
    'Starting Capitalization Hint',
    'Punctuation Hint',
    'Punctuation and Case Hint',
    'Punctuation End Hint',
    'Modified Word Hint',
    'Additional Word Hint',
    'Missing Word Hint',
    'Flexible Modified Word Hint',
    'Flexible Additional Word Hint',
    'Flexible Missing Word Hint',
    'Whitespace Hint',
    'Missing Details Hint',
    'Not Concise Hint',
    'Required Words Hint',
    'Too Short Hint',
    'Too Long Hint',
    'Parts of Speech',
    'Spelling Hint',
  ],

  // cONCEPTS FEEDBACK ACTIONS
  RECEIVE_CONCEPT_FEEDBACK_DATA: 'RECEIVE_CONCEPT_FEEDBACK_DATA',
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
  RECEIVE_SENTENCE_FRAGMENT_DATA: 'RECEIVE_SENTENCE_FRAGMENT_DATA',
  AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE: 'AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE',
  RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE: 'RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE',
  START_SENTENCE_FRAGMENT_EDIT: 'START_SENTENCE_FRAGMENT_EDIT',
  FINISH_SENTENCE_FRAGMENT_EDIT: 'FINISH_SENTENCE_FRAGMENT_EDIT',
  SUBMIT_SENTENCE_FRAGMENT_EDIT: 'SUBMIT_SENTENCE_FRAGMENT_EDIT',
  TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL: 'TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL',

  // sENTENCE_FRAGMENT STATES
  EDITING_SENTENCE_FRAGMENT: 'EDITING_SENTENCE_FRAGMENT',
  SUBMITTING_SENTENCE_FRAGMENT: 'SUBMITTING_SENTENCE_FRAGMENT',

  // TITLE CARD ACTIONS
  RECEIVE_TITLE_CARDS_DATA: 'RECEIVE_TITLE_CARDS_DATA',
  RECEIVE_TITLE_CARDS_DATA_UPDATE: 'RECEIVE_TITLE_CARDS_DATA_UPDATE',

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
  SET_ORIGINAL_EDITION_QUESTIONS: 'SET_ORIGINAL_EDITION_QUESTIONS',
  SET_WORKING_EDITION_QUESTIONS: 'SET_WORKING_EDITION_QUESTIONS',
  SET_WORKING_EDITION_METADATA: 'SET_WORKING_EDITION_METADATA',
  SET_INCOMPLETE_QUESTIONS: 'SET_INCOMPLETE_QUESTIONS',

  // DIAGNOSTIC LESSON ACTIONS
  RECEIVE_DIAGNOSTIC_LESSONS_DATA: 'RECEIVE_DIAGNOSTIC_LESSONS_DATA',

  // NAMING CONSTANTS
  INTERNAL_SENTENCE_COMBINING_TYPE: 'questions',
  INTERNAL_SENTENCE_FRAGMENTS_TYPE: 'sentenceFragments',
  INTERNAL_FILL_IN_BLANK_TYPE: 'fillInBlank',
  INTERNAL_TITLE_CARDS_TYPE: 'titleCards',

  // DEFAULT INSTRUCTIONS FOR QUESTIONS
  DEFAULT_SENTENCE_COMBINING_INSTRUCTIONS: [
    "Combine the sentences into one sentence.",
    "Combine the sentences into one sentence. Use the joining word.",
    "Combine the sentences into one sentence. Use one of the joining words.",
    "Combine the sentences into one sentence. Use both of the joining words.",
    "Combine the sentences into one sentence. Use two of the joining words.",
    "Combine the sentences into one sentence. Do not add any new words.",
    "Combine the sentences into one sentence. Put the describing information at the beginning.",
    "Combine the sentences into one sentence. Put the describing information in the middle.",
    "Combine the sentences into one sentence. Put the -ing phrase at the beginning.",
    "Combine the sentences into one sentence. Put the -ing phrase in the middle.",
    "Combine the sentences into one sentence. Put the -ing phrase at the end."
  ],
  DEFAULT_SENTENCE_FRAGMENT_INSTRUCTIONS: [
    "Make the fragment a complete sentence by adding one word.",
    "Make the fragment a complete sentence by adding two or three words.",
    "Make the fragment a complete sentence by adding one to three words.",
    "Make the fragment a complete sentence by adding two words. You may also need to update the capitalization and punctuation.",
    "Make the fragment a complete sentence by adding to it. Add as few words as possible."
  ],
  DEFAULT_FILL_IN_BLANKS_INSTRUCTIONS: [
    "Fill in the blank with the correct joining word.",
    "Fill in the blank with the correct word.",
    "Fill in the blank with the correct pronoun.",
    "Fill in the blank with the correct action word.",
    "Fill in the blank with the correct set of words."
  ]
};
