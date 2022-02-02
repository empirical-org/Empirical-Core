import C from '../constants';

const initialState = {
  message: '',
  error: ''
}

export default function(currentState, action) {
  let newState = Object.assign({}, currentState || initialState);
  const message = action.message
  const error = action.error
  switch(action.type) {
    case C.DISPLAY_ERROR:
      newState.error = error
      return newState;
    case C.DISPLAY_MESSAGE:
      newState.message = message
      return newState;
    case C.CLEAR_DISPLAY_MESSAGE_AND_ERROR:
      newState.message = ''
      newState.error = ''
      return newState
    default:
      return newState;
  }
}
