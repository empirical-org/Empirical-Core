import C from '../constants'

export type TeacherReducer = {
  showSignupModal: boolean;
  onlyShowHeaders: boolean;
}

type TeacherAction = {
  type: string
  payload?: any
}

const initialState:TeacherReducer = {
  showSignupModal: false,
  onlyShowHeaders: false,
}

export default function (currentState:TeacherReducer = initialState, action: TeacherAction):TeacherReducer {
  switch (action.type) {
  case C.SHOW_SIGNUP_MODAL:
    return Object.assign({}, currentState, {
      showSignupModal: true
    });
  case C.HIDE_SIGNUP_MODAL:
    return Object.assign({}, currentState, {
      showSignupModal: false
    });
  case C.TOGGLE_HEADERS:
    return Object.assign({}, currentState, {
      onlyShowHeaders: !currentState.onlyShowHeaders,
    });
  default: return currentState;
  }
}