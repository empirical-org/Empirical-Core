import { SubmitActions } from '../actions';

const initialState = {
  answeredQuestions: [],
  unansweredQuestions: []
}

function question(state = initialState, action) {
  switch (action.type) {
    case SubmitActions.NEXT_QUESTION:
      var changes = {};
      if (state.currentQuestion) {
        changes.answeredQuestions = state.answeredQuestions.concat([state.currentQuestion])
      }
      changes.currentQuestion = state.unansweredQuestions[0];
      if (changes.currentQuestion) {
        changes.currentQuestion.attempts = [];
      }
      if (state.unansweredQuestions.length > 0) {
        changes.unansweredQuestions = state.unansweredQuestions.slice(1);
      }
      return Object.assign({}, state, changes)
    case SubmitActions.LOAD_DATA:
      var changes2 = {
        unansweredQuestions: require('../utils/' + action.data).default,
        questionSet: action.data};
      return Object.assign({}, state, changes2)
    case SubmitActions.EXIT:
     return Object.assign({}, state, {
        completedQuestions: undefined,
        answeredQuestions: [],
        unansweredQuestions: []
      })
    case SubmitActions.SUBMIT_RESPONSE:
      var changes = {currentQuestion:
        Object.assign({}, state.currentQuestion, {
        attempts: state.currentQuestion.attempts.concat([action.response])
      })}
      return Object.assign({}, state, changes)
    default:
      return state
  }
}

export default question
