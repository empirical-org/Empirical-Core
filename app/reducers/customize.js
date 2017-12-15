import C from '../constants';
import _ from 'lodash';

const initialState = {
  user_id: null,
  editions: {},
  workingEdition: {},
  incompleteQuestions: [],
  coteachers: []
};

export default function (currentstate, action) {
  let newstate;
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
    case C.SET_WORKING_EDITION:
      return Object.assign({}, currentstate, {
        workingEdition: action.edition,
      });
    case C.SET_INCOMPLETE_QUESTIONS:
    return Object.assign({}, currentstate, {
        incompleteQuestions: action.incompleteQuestions,
    });
    default: return currentstate || initialState;
  }
}
