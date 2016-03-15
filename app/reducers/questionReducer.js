import { SubmitActions } from '../actions';

const initialState = {
  answeredQuestions: [],
  unansweredQuestions: []
}

function question(state = initialState, action) {
  switch (action.type) {
    case SubmitActions.NEXT_QUESTION:
      const changes = {};
      if (state.currentQuestion) {
        changes.answeredQuestions = state.answeredQuestions.concat([state.currentQuestion])
      }
      changes.currentQuestion = state.unansweredQuestions[0];
      if (state.unansweredQuestions.length > 0) {
        changes.unansweredQuestions = state.unansweredQuestions.slice(1);
      }
      return Object.assign({}, state, changes)
    case SubmitActions.LOAD_DATA:
      const changes2 = {
        unansweredQuestions: require('../utils/' + action.data).default,
        questionSet: action.data};
      return Object.assign({}, state, changes2)
    case SubmitActions.EXIT:
     return Object.assign({}, state, {
        completedQuestions: undefined,
        answeredQuestions: [],
        unansweredQuestions: []
      })
    default:
      return state
  }
}

export default question
