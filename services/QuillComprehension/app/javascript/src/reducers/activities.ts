import * as R from 'ramda';

import { ActivitiesAction, UPDATE_SUBMISSION, COMPLETE_QUESTION, READ_ARTICLE, CHOOSE_QUESTION_SET, SET_FONT_SIZE } from "../actions/activities";

export interface Submissions {
  [key:number]: string
}

export interface CompleteHash {
  [key:number]: boolean
}

export interface ActivitiesState {
  submissions: Submissions
  complete: CompleteHash
  readArticle: false
  questionSetId: string|null
  fontSize: number
}

export const initialState:ActivitiesState = {
  submissions: {},
  complete: {},
  readArticle: false,
  questionSetId: null,
  fontSize: 2,
}

function activityReducer(state:ActivitiesState=initialState,action?:ActivitiesAction) {
  if (!action) return Object.assign({}, state);
  switch(action.type) {
    case UPDATE_SUBMISSION:
      const submissions = {[action.data.questionId]: action.data.submission}
      return R.mergeDeepRight(state, {
        submissions
      });
    case COMPLETE_QUESTION:
      return R.mergeDeepRight(state, {
        complete: {
          [action.data.questionId]: true
        }
      });
    case CHOOSE_QUESTION_SET:
      return R.mergeDeepRight(state, {questionSetId: action.data.questionSetId})
    case READ_ARTICLE:
      return R.mergeDeepRight(state, {readArticle: true})
    case SET_FONT_SIZE:
      return R.mergeDeepRight(state, {fontSize: action.data.fontSize})
    default:
      return Object.assign({}, state);
  }
}

export default activityReducer