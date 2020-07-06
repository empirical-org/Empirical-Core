import dispatch from '../../__mocks__/dispatch'

const mockGet = jest.fn()
jest.mock('request', () => ({
  get: mockGet
}))

const mockTrackAnalyticsEvent = jest.fn()
jest.mock('../../actions/analytics', () => ({
  TrackAnalyticsEvent: mockTrackAnalyticsEvent
}))

import { getActivity } from '../../actions/activities'
import { Events } from '../../modules/analytics'

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
      const expectedUrl = `https://comprehension-247816.appspot.com/activities/${mockActivityID}`
      expect(mockGet).toBeCalledWith(expectedUrl, expect.anything())
    })
  })
})
