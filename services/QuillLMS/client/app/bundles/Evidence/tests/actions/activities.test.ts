import * as request from 'request';

import dispatch from '../../__mocks__/dispatch'
import { getActivity } from '../../actions/activities'

jest.mock('request', () => ({
  get: jest.fn()
}))

describe('Activities actions', () => {
  describe('when the getActivity action is dispatched', () => {
    const mockSessionID = 'SESSION_ID'
    const mockActivityID = 'ACTIVITY_ID'

    dispatch(getActivity(mockSessionID, mockActivityID))

    it('makes a GET request to the activities API', () => {
      const expectedUrl = `${process.env.DEFAULT_URL}/api/v1/evidence/activities/${mockActivityID}`
      expect(request.get).toBeCalledWith(expectedUrl, expect.anything())
    })
  })
})
