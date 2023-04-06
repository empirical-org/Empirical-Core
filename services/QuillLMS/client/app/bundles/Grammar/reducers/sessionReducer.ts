import * as _ from 'lodash';
import { Action } from "redux";

import { getCurrentQuestion, getFilteredQuestions, getQuestionsWithAttempts } from '../../Shared/index';
import { ActionTypes } from "../actions/actionTypes";
import { Question } from '../interfaces/questions';

export interface SessionState {
  hasreceiveddata: boolean;
  answeredQuestions: Question[]|never;
  unansweredQuestions: Question[]|never;
  questionSet: Question[]|never;
  currentQuestion: Question|null;
  timeTracking: { [key:string]: number };
  proofreaderSession?: any;
  error?: string;
  pending: boolean;
}

type SessionAction = Action & { data: any, attempts: any, response: any, session: any }

const initialState = {hasreceiveddata: false, answeredQuestions: [], unansweredQuestions: [], questionSet: [], currentQuestion: null, pending: true}

export default (
  currentState: SessionState = initialState,
  action: SessionAction,
): SessionState => {
  let currentQuestion: Question|{}
  switch (action.type) {
    case ActionTypes.SET_SESSION:
      return Object.assign({}, currentState, action.session, { pending: false, hasreceiveddata: true })
    case ActionTypes.RECEIVE_QUESTION_DATA:
      return Object.assign({}, currentState, { unansweredQuestions: action.data, hasreceiveddata: true, questionSet: action.data });
    case ActionTypes.NO_QUESTIONS_FOUND_FOR_SESSION:
      return Object.assign({}, currentState, { error: 'No questions found.'})
    case ActionTypes.GO_T0_NEXT_QUESTION:
      const changes: SessionState = Object.assign({}, currentState)
      if (currentState.currentQuestion && !currentState.answeredQuestions.some(question => question.uid === currentState.currentQuestion.uid)) {
        changes.answeredQuestions = currentState.answeredQuestions.concat([currentState.currentQuestion])
      }
      changes.currentQuestion = changes.unansweredQuestions.splice(0, 1)[0]
      // we add the currentQuestion to questionSet only on first load
      if(changes.currentQuestion && !currentState.questionSet.some(question => question && question.uid === changes.currentQuestion.uid)) {
        changes.questionSet = [changes.currentQuestion, ...currentState.questionSet]
      }
      if (changes.currentQuestion) {
        changes.currentQuestion.attempts = []
      }
      return Object.assign({}, currentState, changes)
    case ActionTypes.SUBMIT_RESPONSE:
      currentQuestion = Object.assign({}, currentState.currentQuestion)
      currentQuestion.attempts = currentQuestion.attempts ? currentQuestion.attempts.concat([action.response]) : [action.response]
      return Object.assign({}, currentState, {currentQuestion})
    case ActionTypes.SET_PROOFREADER_SESSION_TO_REDUCER:
      return Object.assign({}, currentState, {proofreaderSession: action.data, timeTracking: action.data.timeTracking})
    case ActionTypes.SET_SESSION_PENDING:
      return Object.assign({}, currentState, {pending: action.pending})
    case ActionTypes.START_NEW_SESSION:
      return Object.assign({}, initialState, { pending: false, })
    case ActionTypes.SET_CURRENT_QUESTION:
      const newState = _.cloneDeep(currentState);
      const { questionSet, unansweredQuestions } = newState;
      let answeredQuestions = newState.answeredQuestions;

      if (newState.currentQuestion) {
        answeredQuestions = answeredQuestions.concat([newState.currentQuestion]);
      }

      const answeredQuestionsWithAttempts = getQuestionsWithAttempts(answeredQuestions);
      const unansweredQuestionsWithAttempts = getQuestionsWithAttempts(unansweredQuestions);
      const newCurrentQuestion = getCurrentQuestion({
        action,
        answeredQuestions,
        questionSet,
        unansweredQuestions
      });

      const currentQuestionIndex = questionSet.findIndex(questionObject => action.question.uid === questionObject.uid);
      const answeredSlice = questionSet.slice(0, currentQuestionIndex);
      const unansweredSlice = questionSet.slice(currentQuestionIndex + 1);

      const newAnsweredQuestions = getFilteredQuestions({ questionsSlice: answeredSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts });
      const newUnansweredQuestions = getFilteredQuestions({ questionsSlice: unansweredSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts });

      newState.answeredQuestions = newAnsweredQuestions;
      newState.unansweredQuestions = newUnansweredQuestions;
      newState.currentQuestion = newCurrentQuestion;
      return Object.assign({}, newState, action.data);
    default:
      return currentState;
  }
};
