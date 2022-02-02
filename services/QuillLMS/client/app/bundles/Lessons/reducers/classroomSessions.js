import C from '../constants';

const initialState = {
  onlyShowHeaders: false,
  hasreceiveddata: false,
  submittingnew: false,
  states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
  data: { current_slide: 0, }, // this will contain firebase data,
  error: '',
  showSignupModal: false
};

export default function (currentState = initialState, action) {
  let newState;
  switch (action.type) {
    case C.UPDATE_CLASSROOM_SESSION_DATA:
      newState = Object.assign({}, currentState, {
        hasreceiveddata: true,
        data: action.data,
      });
      return newState;
    case C.UPDATE_SLIDE_IN_STORE:
      newState = Object.assign({}, JSON.parse(JSON.stringify(currentState)));
      newState.data.current_slide = action.data;
      return newState;
    case C.TOGGLE_HEADERS:

      newState = Object.assign({}, currentState, {
        onlyShowHeaders: !currentState.onlyShowHeaders,
      });
      return newState;
    case C.NO_CLASSROOM_UNIT:
      newState = Object.assign({}, currentState, {
        error: 'missing classroom unit'
      });
      return newState;
    case C.NO_STUDENT_ID:
      newState = Object.assign({}, currentState, {
        error: `No such student. Student with id '${action.data}' does not exist.`,
      });
      return newState;
    case C.SHOW_SIGNUP_MODAL:
      newState = Object.assign({}, currentState, {
        showSignupModal: true
      });
      return newState
    case C.HIDE_SIGNUP_MODAL:
      newState = Object.assign({}, currentState, {
        showSignupModal: false
      });
      return newState
    default: return currentState;
  }
}
