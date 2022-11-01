import {
  mockRequestDelete,
  mockRequestGet,
  mockRequestPost,
  mockRequestPut,
} from '../__mocks__/request_wrapper'
jest.mock('../../../../modules/request/index', () => ({
  requestDelete: mockRequestDelete,
  requestGet: mockRequestGet,
  requestPost: mockRequestPost,
  requestPut: mockRequestPut,
}))

import {
  ConceptFeedbackApi,
  conceptFeedbackApiBaseUrl,
  GRAMMAR_TYPE
} from '../../libs/concept_feedback_api'

import {
  ConceptFeedback,
} from '../../interfaces/concept_feedback'

describe('ConceptFeedbackApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const url = `${conceptFeedbackApiBaseUrl}.json`
      ConceptFeedbackApi.getAll()
      expect(mockRequestGet).toHaveBeenLastCalledWith(url, null, expect.anything())
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_ID = 'id'
      const url = `${conceptFeedbackApiBaseUrl}/${MOCK_ID}.json`
      ConceptFeedbackApi.get(MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url, null, expect.anything())
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_CONTENT : ConceptFeedback = {
        name: 'test',
      }
      const url = `${conceptFeedbackApiBaseUrl}.json`
      ConceptFeedbackApi.create(MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, {concept_feedback: MOCK_CONTENT}, null, expect.anything())
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 'id'
      const MOCK_CONTENT : ConceptFeedback = {
        name: 'test',
      }
      const url = `${conceptFeedbackApiBaseUrl}/${MOCK_ID}.json`
      ConceptFeedbackApi.update(MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {concept_feedback: MOCK_CONTENT}, null, expect.anything())
    })
  })

  describe('remove', () => {
    it('should call requestDelete', () => {
      const MOCK_QUESTION_ID = 'id'
      const url = `${conceptFeedbackApiBaseUrl}/${MOCK_QUESTION_ID}.json`
      ConceptFeedbackApi.remove(MOCK_QUESTION_ID)
      expect(mockRequestDelete).toHaveBeenLastCalledWith(url, null, null, expect.anything())
    })
  })
})
