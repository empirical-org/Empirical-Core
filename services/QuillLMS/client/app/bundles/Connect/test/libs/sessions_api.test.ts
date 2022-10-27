import {
  mockRequestGet,
  mockRequestPut,
} from '../__mocks__/request_wrapper'
jest.mock('../../../../modules/request/index', () => ({
  requestGet: mockRequestGet,
  requestPut: mockRequestPut,
}))

import {
  SessionApi,
  sessionApiBaseUrl,
} from '../../libs/sessions_api'

describe('SessionApi calls', () => {
  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_ID = 'id'
      const url = `${sessionApiBaseUrl}/${MOCK_ID}.json`
      SessionApi.get(MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url, null, expect.anything())
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 'id'
      const MOCK_CONTENT = {
        foo: 'bar',
      }
      const url = `${sessionApiBaseUrl}/${MOCK_ID}.json`
      SessionApi.update(MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {active_activity_session: MOCK_CONTENT}, null, expect.anything())
    })
  })

})
