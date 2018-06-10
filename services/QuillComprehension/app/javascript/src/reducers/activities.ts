import { ActivitiesAction, UPDATE_SUBMISSION, COMPLETE_QUESTION, READ_ARTICLE } from "../actions/activities";
import * as R from 'ramda';

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
}

export const initialState:ActivitiesState = {
  submissions: {},
  complete: {},
  readArticle: false,
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
    case READ_ARTICLE:
      return R.mergeDeepRight(state, {readArticle: true})
    default:
      return Object.assign({}, state);
  }
}

export default activityReducer