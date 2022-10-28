import { ActionTypes } from './actionTypes'
import { TrackAnalyticsEvent } from './analytics'

import { Events } from '../modules/analytics'
import { FeedbackObject } from '../interfaces/feedback'
import { requestGet, requestPut, requestPost, } from '../../../modules/request/index'

interface GetFeedbackArguments {
  sessionID: string,
  activityUID: string,
  entry: string,
  promptID: string,
  promptText: string,
  attempt: number,
  previousFeedback: FeedbackObject[],
  callback: Function,
  activityVersion: number
}

interface CompleteActivitySessionArguments {
  sessionID: string,
  percentage: number,
  conceptResults: any[],
  timeTracking: { [key: number]: number },
  activityId: number,
  callback: Function
}

interface FetchActiveActivitySessionArguments {
  sessionID: string,
  activityUID: string,
  callback: Function
}

interface SaveActiveActivitySessionArguments {
  completedSteps: number[],
  timeTracking: { [key: number]: number },
  callback: Function
}

export const completeActivitySession = (sessionID, activityId, percentage, conceptResults, data, callback) => {
  return (dispatch: Function) => {
    const activitySessionUrl = `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`

    requestPut(
      activitySessionUrl,
      {
        state: 'finished',
        percentage,
        concept_results: conceptResults,
        activity_id: activityId,
        data
      },
      (body) => {
        if (callback) callback()
      }
    )
  }
}

export const processUnfetchableSession = () => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SESION_HAS_NO_DATA })
  }
}

export const setActiveStepForSession = (activeStep: number) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_STEP, activeStep })
  }
}

export const setExplanationSlidesCompletedForSession = (explanationSlidesCompleted: boolean) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SET_EXPLANATIONS_SLIDES_COMPLETED, explanationSlidesCompleted })
  }
}

export const setActivityIsCompleteForSession = (activityIsComplete: boolean) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SET_ACTIVITY_IS_COMPLETE_FOR_SESSION, activityIsComplete })
  }
}

export const fetchActiveActivitySession = ({ sessionID, activityUID, callback, }: FetchActiveActivitySessionArguments) => {
  return (dispatch: Function) => {
    const activeActivitySessionUrl = `${process.env.DEFAULT_URL}/api/v1/active_activity_sessions/${sessionID}`

    dispatch({ type: ActionTypes.SET_ACTIVITY_SESSION_ID, sessionID });

    requestGet(
      activeActivitySessionUrl,
      (body) => {
        const { submittedResponses, } = body
        dispatch({ type: ActionTypes.SET_SUBMITTED_RESPONSES, submittedResponses });
        if (callback) callback(body)
      },
      (body) => {
        dispatch({ type: ActionTypes.SESION_HAS_NO_DATA })
      }
    )
  }
}

export const saveActiveActivitySession = ({ completedSteps, timeTracking, studentHighlights, callback, }: SaveActiveActivitySessionArguments) => {
  return (dispatch: Function, getState: Function) => {
    const { sessionID, submittedResponses, activeStep, } = getState().session
    const activeActivitySessionUrl = `${process.env.DEFAULT_URL}/api/v1/active_activity_sessions/${sessionID}`

    requestPut(
      activeActivitySessionUrl,
      {
        active_activity_session: {
          submittedResponses,
          activeStep,
          completedSteps,
          timeTracking,
          studentHighlights,
        }
      },
      (body) => {
        if (callback) callback()
      }
    )
  }
}

export const saveActivitySurveyResponse = ({ sessionID, activitySurveyResponse, callback, }) => {
  requestPost(
    `${process.env.DEFAULT_URL}/api/v1/activity_survey_responses`,
    {
      activity_survey_response: activitySurveyResponse,
      activity_session_uid: sessionID
    },
    (body) => {
      if (callback) callback()
    },
    (body) => {
      if (callback) callback()
    }
  )
}

export const reportAProblem = ({ sessionID, entry, report, callback, isOptimal }) => {
  const reportAProblemUrl = `${process.env.DEFAULT_URL}/api/v1/student_problem_reports`

  requestPost(
    reportAProblemUrl,
    {
      entry,
      report,
      activity_session_uid: sessionID,
      optimal: isOptimal
    },
    (body) => {
      if (callback) callback()
    }
  )
}

export const getFeedback = (args: GetFeedbackArguments) => {
  const { sessionID, activityUID, entry, promptID, promptText, attempt, previousFeedback, callback, activityVersion } = args
  return (dispatch: Function) => {
    const feedbackURL = `${process.env.GOLANG_FANOUT_URL}`

    const promptRegex = new RegExp(`^${promptText}`)
    const entryWithoutStem = entry.replace(promptRegex, "").trim()
    const mostRecentFeedback = previousFeedback.slice(-1)[0] || {}

    dispatch(TrackAnalyticsEvent(Events.EVIDENCE_ENTRY_SUBMITTED, {
      activityID: activityUID,
      attemptNumber: attempt,
      promptID,
      promptStemText: promptText,
      sessionID,
      startingFeedback: mostRecentFeedback.feedback,
      submittedEntry: entry
    }));

    requestPost(
      feedbackURL,
      {
        prompt_id: promptID,
        session_id: sessionID,
        entry: entryWithoutStem,
        previous_feedback: previousFeedback,
        prompt_text: promptText,
        attempt,
        activity_version: activityVersion
      },
      (body) => {
        const { concept_uid, feedback, feedback_type, optimal, highlight, labels, hint, } = body
        const feedbackObj: FeedbackObject = {
          concept_uid,
          entry,
          feedback,
          feedback_type,
          optimal,
          highlight,
          labels,
          hint,
        }
        dispatch({ type: ActionTypes.RECORD_FEEDBACK, promptID, feedbackObj });
        dispatch(TrackAnalyticsEvent(Events.EVIDENCE_FEEDBACK_RECEIVED, {
          activityID: activityUID,
          attemptNumber: attempt,
          promptID,
          hint,
          promptStemText: promptText,
          returnedFeedback: feedbackObj.feedback,
          sessionID,
          startingFeedback: mostRecentFeedback.feedback,
          submittedEntry: entry
        }));
        callback()
      }
    )

  }
}
