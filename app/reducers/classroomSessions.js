import C from '../constants';

const initialState = {
  onlyShowHeaders: false,
  hasreceiveddata: false,
  submittingnew: false,
  states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
  data: { current_slide: 0, }, // this will contain firebase data,
  error: ''
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
    case C.UPDATE_CLASSROOM_SESSION_WITHOUT_CURRENT_SLIDE:
      newState = Object.assign({}, currentState, {
        hasreceiveddata: true,
        data: action.data,
      });
      newState.data.current_slide = currentState.data.current_slide;
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
    case C.NO_CLASSROOM_ACTIVITY:
      newState = Object.assign({}, currentState, {
        error: `No such classroom activity. Classroom activity with id '${action.data}' does not exist.`,
      });
      return newState;
    default: return currentState;
  }
}
