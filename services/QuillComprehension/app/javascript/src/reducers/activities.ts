import { ActivitiesAction, UPDATE_SUBMISSION, COMPLETE_QUESTION, READ_ARTICLE, CHOOSE_QUESTION_SET } from "../actions/activities";
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
  questionSetId: string|null
}

export const initialState:ActivitiesState = {
  submissions: {},
  complete: {},
  readArticle: false,
  questionSetId: null
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
    default:
      return Object.assign({}, state);
  }
}

export default activityReducer