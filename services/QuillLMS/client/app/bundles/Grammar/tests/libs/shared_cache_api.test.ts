import {
    mockRequestDelete,
    mockRequestGet,
    mockRequestPut
} from '../__mocks__/request_wrapper'
jest.mock('../../../../modules/request/index', () => ({
  requestDelete: mockRequestDelete,
  requestGet: mockRequestGet,
  requestPut: mockRequestPut,
}))

import {
    SharedCacheApi,
    sharedCacheApiBaseUrl
} from '../../libs/shared_cache_api'

describe('SharedCacheApi calls', () => {
  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_ID = 1
      const url = `${sharedCacheApiBaseUrl}/${MOCK_ID}.json`
      SharedCacheApi.get(MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url, null, expect.anything())
    })
  })

  describe('remove', () => {
    it('should call requestDelete', () => {
      const MOCK_ID = 1
      const url = `${sharedCacheApiBaseUrl}/${MOCK_ID}.json`
      SharedCacheApi.remove(MOCK_ID)
      expect(mockRequestDelete).toHaveBeenLastCalledWith(url, null, null, expect.anything())

    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${sharedCacheApiBaseUrl}/${MOCK_ID}.json`
      SharedCacheApi.update(MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {data: MOCK_CONTENT}, null, expect.anything())
    })
  })
})
