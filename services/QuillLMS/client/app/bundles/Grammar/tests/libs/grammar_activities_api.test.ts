import {
    mockRequestDelete,
    mockRequestGet,
    mockRequestPost,
    mockRequestPut
} from '../__mocks__/request_wrapper'
jest.mock('../../../../modules/request/index', () => ({
  requestDelete: mockRequestDelete,
  requestGet: mockRequestGet,
  requestPost: mockRequestPost,
  requestPut: mockRequestPut,
}))

import {
    GrammarActivityApi, grammarActivityApiBaseUrl, TYPE_GRAMMAR_ACTIVITY
} from '../../libs/grammar_activities_api'


describe('GrammarActivityApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const url = `${grammarActivityApiBaseUrl}.json?lesson_type=${TYPE_GRAMMAR_ACTIVITY}`
      GrammarActivityApi.getAll()
      expect(mockRequestGet).toHaveBeenLastCalledWith(url, null, expect.anything())
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_ID = 'id'
      const url = `${grammarActivityApiBaseUrl}/${MOCK_ID}.json`
      GrammarActivityApi.get(MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url, null, expect.anything())
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_CONTENT : ProofreaderActivity = {
        description: 'test',
        title: 'test',
      }
      const url = `${grammarActivityApiBaseUrl}.json?lesson_type=${TYPE_GRAMMAR_ACTIVITY}`
      GrammarActivityApi.create(MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, {lesson: MOCK_CONTENT}, null, expect.anything())
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 'id'
      const MOCK_CONTENT : ProofreaderActivity = {
        description: 'test',
        title: 'test',
      }
      const url = `${grammarActivityApiBaseUrl}/${MOCK_ID}.json`
      GrammarActivityApi.update(MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {lesson: MOCK_CONTENT}, null, expect.anything())
    })
  })

  describe('remove', () => {
    it('should call requestDelete', () => {
      const MOCK_ID = 'id'
      const url = `${grammarActivityApiBaseUrl}/${MOCK_ID}.json`
      GrammarActivityApi.remove(MOCK_ID)
      expect(mockRequestDelete).toHaveBeenLastCalledWith(url, null, null, expect.anything())

    })
  })
})
