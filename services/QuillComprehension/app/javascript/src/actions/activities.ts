export const COMPLETE_QUESTION = "COMPLETE_QUESTION";
export const UPDATE_SUBMISSION = "UPDATE_SUBMISSION";
export const READ_ARTICLE = 'READ_ARTICLE';

export interface ActivitiesActionData {
  questionId:number
  submission?:string
}

export interface ActivitiesAction {
  type:string
  data?:ActivitiesActionData
}

export function completeQuestion(questionId:number):ActivitiesAction {
  return {
    type: COMPLETE_QUESTION, 
    data: {
      questionId
    }
  }
}

export function updateSubmission(questionId:number, submission:string):ActivitiesAction {
  return {
    type: UPDATE_SUBMISSION, 
    data: {
      questionId,
      submission
    }
  }
}

export function markArticleAsRead():ActivitiesAction {
  return {type: READ_ARTICLE}
}