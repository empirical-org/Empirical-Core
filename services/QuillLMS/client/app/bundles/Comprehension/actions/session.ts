import * as request from 'request';

import { ActionTypes } from './actionTypes'
import { TrackAnalyticsEvent } from './analytics'

import { Events } from '../modules/analytics'
import { FeedbackObject } from '../interfaces/feedback'

interface GetFeedbackArguments {
  sessionID: string,
  activityUID: string,
  entry: string,
  promptID: string,
  promptText: string,
  attempt: number,
  previousFeedback: FeedbackObject[],
  callback: Function
}

export const getFeedback = (args: GetFeedbackArguments) => {
  const { sessionID, activityUID, entry, promptID, promptText, attempt, previousFeedback, callback, } = args
  return (dispatch: Function) => {
    // const feedbackURL = 'https://us-central1-comprehension-247816.cloudfunctions.net/comprehension-endpoint-go'
    const feedbackURL = `${process.env.DEFAULT_URL}/api/v1/comprehension/feedback/plagiarism.json`
    const promptRegex = new RegExp(`^${promptText}`)
    const entryWithoutStem = entry.replace(promptRegex, "").trim()
    const mostRecentFeedback = previousFeedback.slice(-1)[0] || {}

    const requestObject = {
      url: feedbackURL,
      body: {
        prompt_id: promptID,
        session_id: sessionID,
        entry: entryWithoutStem,
        previous_feedback: previousFeedback,
        prompt_text: promptText,
        attempt
      },
      json: true,
    }

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_ENTRY_SUBMITTED, {
      activityID: activityUID,
      attemptNumber: attempt,
      promptID,
      promptStemText: promptText,
      sessionID,
      startingFeedback: mostRecentFeedback.feedback,
      startingFeedbackID: mostRecentFeedback.response_id,
      submittedEntry: entry
    }));

    request.post(requestObject, (e, r, body) => {
      const { feedback, feedback_type, optimal, response_id, highlight, labels, } = body
      const feedbackObj: FeedbackObject = {
        entry,
        feedback,
        feedback_type,
        optimal,
        response_id,
        highlight,
        labels
      }
      dispatch({ type: ActionTypes.RECORD_FEEDBACK, promptID, feedbackObj });
      dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_FEEDBACK_RECEIVED, {
        activityID: activityUID,
        attemptNumber: attempt,
        promptID,
        promptStemText: promptText,
        returnedFeedback: feedbackObj.feedback,
        returnedFeedbackID: feedbackObj.response_id,
        sessionID,
        startingFeedback: mostRecentFeedback.feedback,
        startingFeedbackID: mostRecentFeedback.response_id,
        submittedEntry: entry
      }));
      callback()
    })
  }
}
