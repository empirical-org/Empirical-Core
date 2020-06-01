import {
  mockRequestDelete,
  mockRequestGet,
  mockRequestPost,
  mockRequestPut,
} from '../__mocks__/request_wrapper'
jest.mock('../../app/libs/request', () => ({
  requestDelete: mockRequestDelete,
  requestGet: mockRequestGet,
  requestPost: mockRequestPost,
  requestPut: mockRequestPut,
}))

import {
  SessionApi,
  sessionApiBaseUrl,
} from '../../app/libs/sessions_api'

describe('SessionApi calls', () => {
  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_ID = 'id'
      const url = `${sessionApiBaseUrl}/${MOCK_ID}.json`
      SessionApi.get(MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_CONTENT  = {
        foo: 'bar',
      }
      const url = `${sessionApiBaseUrl}.json`
      SessionApi.create(MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, {active_activity_session: MOCK_CONTENT})
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
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {active_activity_session: MOCK_CONTENT})
    })
  })

  describe('remove', () => {
    it('should call requestDelete', () => {
      const MOCK_ID = 'id'
      const url = `${sessionApiBaseUrl}/${MOCK_ID}.json`
      SessionApi.remove(MOCK_ID)
      expect(mockRequestDelete).toHaveBeenLastCalledWith(url)
    })
  })
})
