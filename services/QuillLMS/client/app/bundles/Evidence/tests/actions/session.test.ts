const mockTrackAnalyticsEvent = jest.fn()
jest.mock('../../actions/analytics', () => ({
  TrackAnalyticsEvent: mockTrackAnalyticsEvent
}))

const mockPost = jest.fn()
jest.mock('../../../../modules/request/index', () => ({
  requestPost: mockPost
}))

import { getFeedback } from '../../actions/session'
import { Events } from '../../modules/analytics'
import dispatch from '../../__mocks__/dispatch'

describe('Session actions', () => {
  describe('when the getFeedback action is dispatched', () => {
    const mockSessionID = 'SESSION_ID'
    const mockActivityID = 'ACTIVITY_ID'
    const mockPromptAndEntry = 'This is great because Student entry'
    const mockEntry = 'Student entry'
    const mockPromptID = 'PROMPT_ID'
    const mockPromptText = 'This is great because'
    const mockAttempt = 1
    const mockStartingFeedback = 'Starting feedback'
    const mockPreviousFeedback = [{
      feedback: mockStartingFeedback
    }]
    const mockCallback = jest.fn()

    const mockArgs = {
      sessionID: mockSessionID,
      activityUID: mockActivityID,
      entry: mockPromptAndEntry,
      promptID: mockPromptID,
      promptText: mockPromptText,
      attempt: mockAttempt,
      previousFeedback: mockPreviousFeedback,
      callback: mockCallback
    }

    dispatch(getFeedback(mockArgs))

    it('sends a EVIDENCE_ENTRY_SUBMITTED analytics event', () => {
      expect(mockTrackAnalyticsEvent).toBeCalledWith(Events.EVIDENCE_ENTRY_SUBMITTED, {
        activityID: mockActivityID,
        attemptNumber: mockAttempt,
        promptID: mockPromptID,
        promptStemText: mockPromptText,
        sessionID: mockSessionID,
        startingFeedback: mockStartingFeedback,
        submittedEntry: mockPromptAndEntry
      })
    })

    it('makes a POST request to the feedback API', () => {
      const body = {
        prompt_id: mockPromptID,
        prompt_text: mockPromptText,
        session_id: mockSessionID,
        entry: mockEntry,
        previous_feedback: mockPreviousFeedback,
        attempt: mockAttempt
      }
      expect(mockPost).toBeCalledWith(`${process.env.DEFAULT_URL}/api/v1/evidence/feedback/`, body, expect.anything())
    })
  })
})
