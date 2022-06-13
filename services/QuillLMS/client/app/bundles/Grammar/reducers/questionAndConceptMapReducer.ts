import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { DashboardConceptRow, DashboardQuestionRow } from '../interfaces/dashboards'
import * as _ from 'lodash'

export interface QuestionAndConceptMapReducerState {
  hasreceiveddata: boolean;
  data?: { questionRows: Array<DashboardQuestionRow>, conceptRows: Array<DashboardConceptRow>}
}

type QuestionAndConceptMapReducerAction = Action & { data: { questionRows: Array<DashboardQuestionRow>, conceptRows: Array<DashboardConceptRow>} }

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
