import * as React from 'react'
import { mount, } from 'enzyme';
import toJson from 'enzyme-to-json';

const mockTrackAnalyticsEvent = jest.fn()
jest.mock('../../actions/analytics', () => ({
  TrackAnalyticsEvent: mockTrackAnalyticsEvent
}))

const MockSessionID = 'MockSessionId'
const MockActivityID = 1
const mockGetParameterByName = jest.fn()
  .mockReturnValueOnce(MockSessionID)
  .mockReturnValue(MockActivityID)
jest.mock('../../helpers/getParameterByName', () => ({
  default: mockGetParameterByName
}))

import { Header } from '../../components/Header'
import { Events } from '../../modules/analytics'

const dispatch = () => {}

describe('StudentViewContainer component', () => {
  describe('when the activity has loaded', () => {
    const wrapper = mount(<Header
      dispatch={dispatch}
      session={{}}
    />)

    it('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    describe('when a user clicks "Save and exit"', () => {
      it('should track a EVIDENCE_ACTIVITY_SAVED event', () => {
        wrapper.find('.save-and-exit').simulate('click')

        expect(mockTrackAnalyticsEvent).toHaveBeenCalledWith(Events.EVIDENCE_ACTIVITY_SAVED, {
          event: Events.EVIDENCE_ACTIVITY_SAVED,
          activityID: MockActivityID,
          sessionID: MockSessionID
        })
      })
    })
  })
})
