import * as request from 'request';

import { ActionTypes } from './actionTypes'

import { FeedbackObject } from '../interfaces/feedback'

export const getFeedback = (activityUID: string, entry: string, promptID: string, promptText: string) => {
  return (dispatch: Function) => {
    const feedbackURL = 'https://us-central1-comprehension-247816.cloudfunctions.net/comprehension-endpoint-go'
    const promptRegex = new RegExp(`^${promptText}`)
    const entryWithoutStem = entry.replace(promptRegex, "").trim()

    const requestObject = {
      url: feedbackURL,
      body: {prompt_id: promptID, entry: entryWithoutStem},
      json: true,
    }

    request.post(requestObject, (e, r, body) => {
      const feedbackObj: FeedbackObject = {
        feedback: body.feedback,
        feedback_type: body.feedback_type,
        optimal: body.optimal,
        response_id: body.response_id,
        entry,
      }
      dispatch({ type: ActionTypes.RECORD_FEEDBACK, promptID, feedbackObj });
    })
  }
}
