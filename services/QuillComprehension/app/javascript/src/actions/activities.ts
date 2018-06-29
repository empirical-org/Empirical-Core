export const COMPLETE_QUESTION = "COMPLETE_QUESTION";
export const UPDATE_SUBMISSION = "UPDATE_SUBMISSION";
export const READ_ARTICLE = 'READ_ARTICLE';
export const CHOOSE_QUESTION_SET = 'CHOOSE_QUESTION_SET';
export const SET_FONT_SIZE = 'SET_FONT_SIZE';

export interface ActivitiesActionData {
  questionId?:number
  submission?:string
  questionSetId?:number
  fontSize?:number
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

export function chooseQuestionSet(questionSetId:number):ActivitiesAction {
  return {
    type: CHOOSE_QUESTION_SET, 
    data: {
      questionSetId
    }
  }
}

export function setFontSize(fontSize:number):ActivitiesAction {
  return {
    type: SET_FONT_SIZE,
    data: {
      fontSize
    }
  }
}