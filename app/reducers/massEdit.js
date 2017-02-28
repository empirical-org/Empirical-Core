import C from '../constants';

const initialState = {
  selectedResponses: [],
}

export default function(currentState, action) {
  let newState = Object.assign({}, currentState || initialState);
  let responseKey = action.responseKey;
  switch(action.type) {
    case C.ADD_RESPONSE_TO_MASS_EDIT_ARRAY:
      if(newState.selectedResponses.indexOf(responseKey) < 0) {
        newState.selectedResponses.push(responseKey);
      }
      console.log(newState.selectedResponses);
      return newState;
    case C.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY:
      if(newState.selectedResponses.indexOf(responseKey) > -1) {
        newState.selectedResponses.splice(newState.selectedResponses.indexOf(responseKey), 1);
      }
      console.log(newState.selectedResponses);
      return newState;
    case C.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY:
      newState.selectedResponses = [];
      console.log(newState.selectedResponses);
      return newState;
    default:
      console.log(newState.selectedResponses);
      return newState;
  }
}
