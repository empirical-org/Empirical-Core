import C from '../constants';

const initialState = {
  responses: [],
}

export default function(currentState, action) {
  let newState = currentState || initialState;
  let responseKey = action.data;
  switch(action.type) {
    case C.ADD_RESPONSE_TO_MASS_EDIT_ARRAY:
      if(newState.responses.indexOf(responseKey) < 0) {
        newState.responses.push(responseKey);
      }
      return newState;
    case C.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY:
      if(newState.responses.indexOf(responseKey) > -1) {
        newState.responses.splice(newState.responses.indexOf(responseKey));
      }
      return newState;
    case C.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY:
      newState.responses = [];
      return newState;
    default:
      return newState;
  }
}
