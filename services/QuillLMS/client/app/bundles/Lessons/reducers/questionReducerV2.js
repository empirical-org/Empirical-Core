import { SubmitActions } from '../actions';

const initialState = {
  attempts: []
}

function question(state = initialState, action) {
  switch (action.type) {
    case SubmitActions.SUBMIT_RESPONSE_ANON:
    // // console.log("Action: ", action)
      var changes = {
        attempts: state.attempts.concat([action.response])
      }
      return Object.assign({}, state, changes)
    case SubmitActions.CLEAR_RESPONSES_ANON:
      return Object.assign({}, state, initialState)
    default:
      return state
  }
}

export default question
