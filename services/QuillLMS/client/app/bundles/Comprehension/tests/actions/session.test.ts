import dispatch from '../../__mocks__/dispatch'

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

describe('Session actions', () => {
  describe('when the getFeedback action is dispatched', () => {
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

    const mockArgs = {
      sessionID: mockSessionID,
      activityUID: mockActivityID,
      entry: mockEntry,
      promptID: mockPromptID,
      promptText: mockPromptText,
      attempt: mockAttempt,
      previousFeedback: mockPreviousFeedback,
      callback: mockCallback
    }

    dispatch(getFeedback(mockArgs))

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
          prompt_text: mockPromptText,
          session_id: mockSessionID,
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
