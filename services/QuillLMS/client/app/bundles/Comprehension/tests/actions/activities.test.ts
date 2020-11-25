import dispatch from '../../__mocks__/dispatch'
import { getActivity } from '../../actions/activities'
import { Events } from '../../modules/analytics'

const mockGet = jest.fn()
jest.mock('request', () => ({
  get: mockGet
}))

const mockTrackAnalyticsEvent = jest.fn()
jest.mock('../../actions/analytics', () => ({
  TrackAnalyticsEvent: mockTrackAnalyticsEvent
}))

describe('Activities actions', () => {
  describe('when the getActivity action is dispatched', () => {
    const mockSessionID = 'SESSION_ID'
    const mockActivityID = 'ACTIVITY_ID'

    dispatch(getActivity(mockSessionID, mockActivityID))

    it('sends a COMPREHENSION_ACTIVITY_STARTED analytics event', () => {
      expect(mockTrackAnalyticsEvent).toBeCalledWith(Events.COMPREHENSION_ACTIVITY_STARTED, {
        activityID: mockActivityID,
        sessionID: mockSessionID
      })
    })

    it('makes a GET request to the activities API', () => {
      const expectedUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/comprehension/activities/${mockActivityID}.json`
      expect(mockGet).toBeCalledWith(expectedUrl, expect.anything())
    })
  })
})
