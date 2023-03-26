import { requestGet } from '../../../../modules/request/index'
import { getActivity } from '../../actions/activities'
import { TrackAnalyticsEvent } from '../../actions/analytics'
import { Events } from '../../modules/analytics'
import dispatch from '../../__mocks__/dispatch'

jest.mock('../../../../modules/request/index', () => ({
  requestGet: jest.fn()
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
        activityID: mockActivityID,
        sessionID: mockSessionID
      })
    })

    it('makes a GET request to the activities API', () => {
      const expectedUrl = `${process.env.DEFAULT_URL}/api/v1/evidence/activities/${mockActivityID}`
      expect(requestGet).toBeCalledWith(expectedUrl, expect.anything())
    })
  })
})
