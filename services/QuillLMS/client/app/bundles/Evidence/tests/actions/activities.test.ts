import * as request from 'request';

import dispatch from '../../__mocks__/dispatch'
import { getActivity } from '../../actions/activities'
import { TrackAnalyticsEvent } from '../../actions/analytics'
import { Events } from '../../modules/analytics'

jest.mock('request', () => ({
  get: jest.fn()
}))
jest.mock('../../actions/analytics', () => ({
  TrackAnalyticsEvent: jest.fn()
}))

describe('Activities actions', () => {
  describe('when the getActivity action is dispatched', () => {
    const mockSessionID = 'SESSION_ID'
    const mockActivityID = 'ACTIVITY_ID'

    dispatch(getActivity(mockSessionID, mockActivityID))

    it('sends an EVIDENCE_ACTIVITY_STARTED analytics event', () => {
      expect(TrackAnalyticsEvent).toBeCalledWith(Events.EVIDENCE_ACTIVITY_STARTED, {
        event: Events.EVIDENCE_ACTIVITY_STARTED,
        activityID: mockActivityID,
        sessionID: mockSessionID
      })
    })

    it('makes a GET request to the activities API', () => {
      const expectedUrl = `${process.env.DEFAULT_URL}/api/v1/evidence/activities/${mockActivityID}`
      expect(request.get).toBeCalledWith(expectedUrl, expect.anything())
    })
  })
})
