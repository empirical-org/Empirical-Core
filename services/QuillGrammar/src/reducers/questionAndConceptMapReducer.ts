import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { Questions } from '../interfaces/questions'
import * as _ from 'lodash'

export interface QuestionAndConceptMapReducerState {
  hasreceiveddata: boolean;
  data?: { questionRows: Array<any>, conceptRows: Array<any>}
}

type QuestionAndConceptMapReducerAction = Action & { data: { questionRows: Array<any>, conceptRows: Array<any>} }

export default (
    currentState = {hasreceiveddata: false},
    action: QuestionAndConceptMapReducerAction,
) => {
    switch (action.type) {
    case ActionTypes.RECEIVE_GRAMMAR_QUESTION_AND_CONCEPT_MAP:
      return Object.assign({}, currentState, {
        hasreceiveddata: true,
        data: action.data,
      });
      default:
          return currentState;
    }
};
