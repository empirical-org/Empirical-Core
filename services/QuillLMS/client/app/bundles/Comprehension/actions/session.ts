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

interface CompleteActivitySessionArguments {
  sessionID: string,
  percentage: number,
  conceptResults: any[],
  callback: Function
}

interface FetchActiveActivitySessionArguments {
  sessionID: string,
  activityUID: string,
  callback: Function
}

interface SaveActiveActivitySessionArguments {
  sessionID: string,
  submittedResponses: { [key: string]: FeedbackObject[] }|{},
  activeStep: number,
  completedSteps: number[],
  callback: Function
}

export const completeActivitySession = (sessionID, percentage, conceptResults, callback) => {
  return (dispatch: Function) => {
    const activitySessionUrl = `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`
    const requestObject = {
      url: activitySessionUrl,
      body: {
        state: 'finished',
        percentage,
        concept_results: conceptResults
      },
      json: true,
    }

    request.put(requestObject, (e, r, body) => {
      if (callback) callback()
    })
  }
}

export const processUnfetchableSession = () => {
  return (dispatch: Function) => {
      dispatch({ type: ActionTypes.SESION_HAS_NO_DATA })
  }
}

export const fetchActiveActivitySession = ({ sessionID, activityUID, callback, }: FetchActiveActivitySessionArguments) => {
  return (dispatch: Function) => {
    const activeActivitySessionUrl = `${process.env.DEFAULT_URL}/api/v1/active_activity_sessions/${sessionID}`

    dispatch({ type: ActionTypes.SET_ACTIVITY_SESSION_ID, sessionID });

    const requestObject = {
      url: activeActivitySessionUrl,
      json: true,
    }

    request.get(requestObject, (e, r, body) => {
      if (r.statusCode < 200 || r.statusCode >= 300) {
        dispatch({ type: ActionTypes.SESION_HAS_NO_DATA })
        return
      }
      const { submittedResponses, } = body
      dispatch({ type: ActionTypes.SET_SUBMITTED_RESPONSES, submittedResponses });
      if (callback) callback(body)
    })
  }
}

export const saveActiveActivitySession = ({ sessionID, submittedResponses, activeStep, completedSteps, callback, }: SaveActiveActivitySessionArguments) => {
  return (dispatch: Function) => {
    const activeActivitySessionUrl = `${process.env.DEFAULT_URL}/api/v1/active_activity_sessions/${sessionID}`

    const requestObject = {
      url: activeActivitySessionUrl,
      body: {
        active_activity_session: {
          submittedResponses,
          activeStep,
          completedSteps
        }
      },
      json: true,
    }

    request.put(requestObject, (e, r, body) => {
      if (callback) callback()
    })
  }
}

export const getFeedback = (args: GetFeedbackArguments) => {
  const { sessionID, activityUID, entry, promptID, promptText, attempt, previousFeedback, callback, } = args
  return (dispatch: Function) => {
    const feedbackURL = 'https://us-central1-comprehension-247816.cloudfunctions.net/comprehension-endpoint-go'
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
