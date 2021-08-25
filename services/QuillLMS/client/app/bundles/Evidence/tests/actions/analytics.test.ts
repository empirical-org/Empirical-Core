import dispatch from '../../__mocks__/dispatch'

const mockTrack = jest.fn()
jest.mock('../../modules/analytics', () => ({
  SegmentAnalytics: {
    track: mockTrack
  }
}))

import { TrackAnalyticsEvent } from '../../actions/analytics'

describe('Analytics action', () => {
  describe('when TrackAnalytics event is dispatched', () => {
    it('makes a call to SegmentAnalytics.track', () => {
      const mockEvent = 'MOCK_EVENT'
      const mockParams = {foo: 'bar'}
      dispatch(TrackAnalyticsEvent(mockEvent, mockParams))
      expect(mockTrack).toBeCalledWith(mockEvent, mockParams)
    })
  })
})
