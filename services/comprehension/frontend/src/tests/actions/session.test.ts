import dispatch from '../../../__mocks__/dispatch'

const mockPost = jest.fn()
jest.mock('request', () => ({
  post: mockPost
}))

const mockTrackAnalyticsEvent = jest.fn()
jest.mock('../../actions/analytics', () => ({
  TrackAnalyticsEvent: mockTrackAnalyticsEvent
}))

import { getFeedback } from '../../actions/session'
import { Events } from '../../modules/analytics'

describe('Activities actions', () => {
  describe('when the getActivity action is dispatched', () => {
    const mockSessionID = 'SESSION_ID'
    const mockActivityID = 'ACTIVITY_ID'
    const mockEntry = 'Student entry'
    const mockPromptID = 'PROMPT_ID'
    const mockPromptText = 'This is great because'
    const mockAttempt = 1
    const mockStartingFeedback = 'Starting feedback'
    const mockStartingFeedbackID = 'STARTING_FEEDBACK_ID'
    const mockPreviousFeedback = [{
      feedback: mockStartingFeedback,
      response_id: mockStartingFeedbackID
    }]
    const mockCallback = jest.fn()

    dispatch(getFeedback(mockSessionID, mockActivityID, mockEntry, mockPromptID, mockPromptText, mockAttempt, mockPreviousFeedback, mockCallback))

    it('sends a COMPREHENSION_ENTRY_SUBMITTED analytics event', () => {
      expect(mockTrackAnalyticsEvent).toBeCalledWith(Events.COMPREHENSION_ENTRY_SUBMITTED, {
        activityID: mockActivityID,
        attemptNumber: mockAttempt,
        promptID: mockPromptID,
        promptStemText: mockPromptText,
        sessionID: mockSessionID,
        startingFeedback: mockStartingFeedback,
        startingFeedbackID: mockStartingFeedbackID,
        submittedEntry: mockEntry
      })
    })

    it('makes a POST request to the feedback API', () => {
      const expectedRequest = {
        url: `https://us-central1-comprehension-247816.cloudfunctions.net/comprehension-endpoint-go`,
        body: {
          prompt_id: mockPromptID,
          entry: mockEntry,
          previous_feedback: mockPreviousFeedback,
          attempt: mockAttempt
        },
        json: true
      }
      expect(mockPost).toBeCalledWith(expectedRequest, expect.anything())
    })
  })
})


//import { ActionTypes } from './actionTypes'
//import { TrackAnalyticsEvent } from './analytics'
//import { Events } from '../modules/analytics'
//
//import { FeedbackObject } from '../interfaces/feedback'
//
//export const getFeedback = (sessionID: string, activityUID: string, entry: string, promptID: string, promptText: string, attempt: number, previousFeedback: FeedbackObject[], callback: Function = () => {}) => {
//  return (dispatch: Function) => {
//    const feedbackURL = 'https://us-central1-comprehension-247816.cloudfunctions.net/comprehension-endpoint-go'
//    const promptRegex = new RegExp(`^${promptText}`)
//    const entryWithoutStem = entry.replace(promptRegex, "").trim()
//    const mostRecentFeedback = previousFeedback.slice(-1)[0] || {}
//
//    const requestObject = {
//      url: feedbackURL,
//      body: {
//        prompt_id: promptID,
//        entry: entryWithoutStem,
//        previous_feedback: previousFeedback,
//        attempt
//      },
//      json: true,
//    }
//
//    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_ENTRY_SUBMITTED, {
//      activityID: activityUID,
//      attemptNumber: attempt,
//      promptID,
//      promptStemText: promptText,
//      sessionID,
//      startingFeedback: mostRecentFeedback.feedback,
//      startingFeedbackID: mostRecentFeedback.response_id,
//      submittedEntry: entry
//    }));
//
//    request.post(requestObject, (e, r, body) => {
//      const { feedback, feedback_type, optimal, response_id, highlight, labels, } = body
//      const feedbackObj: FeedbackObject = {
//        entry,
//        feedback,
//        feedback_type,
//        optimal,
//        response_id,
//        highlight,
//        labels
//      }
//      dispatch({ type: ActionTypes.RECORD_FEEDBACK, promptID, feedbackObj });
//      dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_FEEDBACK_RECEIVED, {
//        activityID: activityUID,
//        attemptNumber: attempt,
//        promptID,
//        promptStemText: promptText,
//        returnedFeedback: feedbackObj.feedback,
//        returnedFeedbackID: feedbackObj.response_id,
//        sessionID,
//        startingFeedback: mostRecentFeedback.feedback,
//        startingFeedbackID: mostRecentFeedback.response_id,
//        submittedEntry: entry
//      }));
//      callback()
//    })
//  }
//}
