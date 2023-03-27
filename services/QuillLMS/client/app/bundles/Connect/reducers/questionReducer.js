import { getCurrentQuestion, getFilteredQuestions, getQuestionsWithAttempts } from '../../Shared/index';
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
              attempts: state.currentQuestion.question.attempts ? state.currentQuestion.question.attempts.concat([action.response]) : [action.response]
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
    case SubmitActions.SET_CURRENT_QUESTION:
      const { currentQuestion, questionSet, unansweredQuestions } = state;
      let answeredQuestions = state.answeredQuestions;

      if (currentQuestion) {
        answeredQuestions = answeredQuestions.concat([currentQuestion]);
      }

      const answeredQuestionsWithAttempts = getQuestionsWithAttempts(answeredQuestions);
      const unansweredQuestionsWithAttempts = getQuestionsWithAttempts(unansweredQuestions);

      const newCurrentQuestion = getCurrentQuestion({
        action,
        answeredQuestions,
        questionSet,
        unansweredQuestions
      });

      const currentQuestionIndex = questionSet.findIndex(questionObject => action.data.key === questionObject.question.key);
      const answeredSlice = questionSet.slice(0, currentQuestionIndex);
      const unansweredSlice = questionSet.slice(currentQuestionIndex + 1);

      const newAnsweredQuestions = getFilteredQuestions({ questionsSlice: answeredSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts });
      const newUnansweredQuestions = getFilteredQuestions({ questionsSlice: unansweredSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts });

      state.answeredQuestions = newAnsweredQuestions;
      state.unansweredQuestions = newUnansweredQuestions;
      state.currentQuestion = newCurrentQuestion;

      return Object.assign({}, state, action.data);
    default:
      return state
  }
}

export default question
