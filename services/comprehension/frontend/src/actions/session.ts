import * as request from 'request';

import { ActionTypes } from './actionTypes'

import FeedbackObject from '../interfaces/feedback'

export const getFeedback = (activityUID: number, entry: string, promptId: number) => {
  return (dispatch: Function) => {
    request.get(`https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/${activityUID}/responses.json`, (e, r, body) => {
      const responses = JSON.parse(body)
      let feedbackObj: FeedbackObject = {
        feedback: "Good start! You stated that compulsory voting will ensure that more voices are heard. Now take it one step further—according to the passage, why is it important that more voices are heard?",
        feedback_type: "semantic",
        optimal: false,
        response_id: "q23123@3sdfASDF",
      }
      const matchedResponse = responses.find((r: any) => r.text === entry)
      if (matchedResponse) {
        feedbackObj = {
          feedback: "That's a really strong sentence! You used evidence from the text to identify why governments should make voting compulsory.",
          feedback_type: "semantic",
          optimal: true,
          response_id: matchedResponse.response_id,
        	highlight: [ {
            type: "response",
        		id: null,
        		text: "misspelllling"
          }]
        }
      }
      dispatch({ type: ActionTypes.RECORD_FEEDBACK, data: { promptId, feedbackObj }, });
    })
  }
}
