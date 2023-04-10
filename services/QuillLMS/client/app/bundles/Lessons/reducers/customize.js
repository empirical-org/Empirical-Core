import C from '../constants';

const initialState = {
  user_id: null,
  editions: {},
  workingEditionMetadata: {},
  workingEditionQuestions: {},
  incompleteQuestions: [],
  coteachers: [],
  editionQuestions: {},
  originalEditionQuestions: {},
};

export default function (currentstate, action) {
  switch (action.type) {
    case C.SET_USER_ID:
      return Object.assign({}, currentstate, {
        user_id: action.id,
      });
    case C.SET_COTEACHERS:
      return Object.assign({}, currentstate, {
        coteachers: action.coteachers,
      });
    case C.SET_EDITION_METADATA:
      return Object.assign({}, currentstate, {
        editions: action.editionMetadata,
      });
    case C.SET_EDITION_QUESTIONS:
      return Object.assign({}, currentstate, {
        editionQuestions: action.editionQuestions,
      });
    case C.SET_ORIGINAL_EDITION_QUESTIONS:
      return Object.assign({}, currentstate, {
        originalEditionQuestions: action.originalEditionQuestions,
      });
    case C.SET_WORKING_EDITION_QUESTIONS:
      return Object.assign({}, currentstate, {
        workingEditionQuestions: action.questions,
      });
    case C.SET_WORKING_EDITION_METADATA:
      return Object.assign({}, currentstate, {
        workingEditionMetadata: action.metadata,
      });
    case C.SET_INCOMPLETE_QUESTIONS:
      return Object.assign({}, currentstate, {
        incompleteQuestions: action.incompleteQuestions,
      });
    default: return currentstate || initialState;
  }
}

export function getIncompleteQuestions(store) {
  return store.incompleteQuestions;
}

export function getEditionMetadata(store) {
  return store.editions;
}

export function getEditionQuestions(store) {
  return store.editionQuestions;
}

export function getOriginalEditionQuestions(store) {
  return store.originalEditionQuestions;
}

