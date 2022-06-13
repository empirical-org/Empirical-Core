import { SubmitActions } from '../actions';
/// make this playLessonsReducer.
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
      if (changes.currentQuestion && changes.currentQuestion.question) {
        changes.currentQuestion.question.attempts = [];
      }
      if (state.unansweredQuestions.length > 0) {
        changes.unansweredQuestions = state.unansweredQuestions.slice(1);
      }
      return Object.assign({}, state, changes)
    case SubmitActions.LOAD_DATA:
      var changes2 = {
        unansweredQuestions: action.data,
        questionSet: action.data};
      return Object.assign({}, state, changes2)
    case SubmitActions.CLEAR_DATA:
      return initialState
    case SubmitActions.EXIT:
      return Object.assign({}, state, {
        completedQuestions: undefined,
        answeredQuestions: [],
        unansweredQuestions: []
      })
    case SubmitActions.SUBMIT_RESPONSE:
      var changes = {currentQuestion:
        Object.assign({}, state.currentQuestion, {
          question: Object.assign({},
            state.currentQuestion.question,
            {
              attempts: state.currentQuestion.question.attempts.concat([action.response])
            })
        })
      }
      return Object.assign({}, state, changes)
    case SubmitActions.START_QUESTION:
      var changes = {currentQuestion:
      Object.assign({}, state.currentQuestion, {
        started: true
      })}
      return Object.assign({}, state, changes)
    case SubmitActions.UPDATE_NAME:
      var changes = {name: action.data}
      return Object.assign({}, state, changes)
    case SubmitActions.UPDATE_CURRENT_QUESTION:
      var changes = {currentQuestion:
      Object.assign({}, state.currentQuestion, {
        question: Object.assign({},
          state.currentQuestion.question,
          action.data)
      })
      }
      return Object.assign({}, state, changes)
    case SubmitActions.RESUME_PREVIOUS_SESSION:
      return Object.assign({}, state, action.data)
    default:
      return state
  }
}

export default question
