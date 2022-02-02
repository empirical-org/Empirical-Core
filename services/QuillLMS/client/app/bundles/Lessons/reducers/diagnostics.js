import { SubmitActions } from '../actions/diagnostics.js';
// / make this playLessonsReducer.
const initialState = {
  answeredQuestions: [],
  unansweredQuestions: [],
};

function question(state = initialState, action) {
  switch (action.type) {
    case SubmitActions.NEXT_DIAGNOSTIC_QUESTION:
      var changes = {};
      if (state.currentQuestion) {
        changes.answeredQuestions = state.answeredQuestions.concat([state.currentQuestion]);
      }
      changes.currentQuestion = state.unansweredQuestions[0];
      if (changes.currentQuestion) {
        changes.currentQuestion.data.attempts = [];
      }
      if (state.unansweredQuestions.length > 0) {
        changes.unansweredQuestions = state.unansweredQuestions.slice(1);
      }
      return Object.assign({}, state, changes);
    case SubmitActions.NEXT_DIAGNOSTIC_QUESTION_WITHOUT_SAVING:
      var changes = {};
      changes.currentQuestion = state.unansweredQuestions[0];
      if (changes.currentQuestion) {
        changes.currentQuestion.data.attempts = [];
      }
      if (state.unansweredQuestions.length > 0) {
        changes.unansweredQuestions = state.unansweredQuestions.slice(1);
      }
      return Object.assign({}, state, changes);
    case SubmitActions.LOAD_DIAGNOSTIC_DATA:
      var changes2 = {
        unansweredQuestions: action.data,
        questionSet: action.data, };
      return Object.assign({}, state, changes2);
    case SubmitActions.CLEAR_DIAGNOSTIC_DATA:
      return initialState;
    case SubmitActions.EXIT_DIAGNOSTIC:
      return Object.assign({}, state, {
        completedQuestions: undefined,
        answeredQuestions: [],
        unansweredQuestions: [],
      });
    case SubmitActions.SUBMIT_DIAGNOSTIC_RESPONSE:
      if (state.currentQuestion && state.currentQuestion.data) {
        var changes = { currentQuestion: Object.assign({}, state.currentQuestion, {
          data: Object.assign({},
            state.currentQuestion.data,
            {
              attempts: state.currentQuestion.data.attempts.concat([action.response]),
            }),
        }),
        };
        return Object.assign({}, state, changes);
      }
    case SubmitActions.START_DIAGNOSTIC_QUESTION:
      var changes = { currentQuestion:
      Object.assign({}, state.currentQuestion, {
        started: true,
      }), };
      return Object.assign({}, state, changes);
    case SubmitActions.UPDATE_DIAGNOSTIC_NAME:
      var changes = { name: action.data, };
      return Object.assign({}, state, changes);
    case SubmitActions.UPDATE_DIAGNOSTIC_LANGUAGE:
      var changes = { language: action.data, };
      return Object.assign({}, state, changes);
    case SubmitActions.UPDATE_DIAGNOSTIC_CURRENT_QUESTION:
      var change = action.data;
      var changes = { currentQuestion: Object.assign({}, state.currentQuestion, {
        data: Object.assign({},
          state.currentQuestion.data,
          change
        ),
      }), };
      return Object.assign({}, state, changes);
    case SubmitActions.RESUME_PREVIOUS_DIAGNOSTIC_SESSION:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}

export default question;
