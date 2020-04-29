import {
  mockRequestDelete,
  mockRequestGet,
  mockRequestPost,
  mockRequestPut,
} from '../__mocks__/request_wrapper'
jest.mock('../../lib/request', () => ({
  requestDelete: mockRequestDelete,
  requestGet: mockRequestGet,
  requestPost: mockRequestPost,
  requestPut: mockRequestPut,
}))

import {
  ProofreaderPassageApi,
  PROOFREADER_PASSAGE_TYPE,
  questionApiBaseUrl,
} from '../../lib/proofreader_activities_api'

import {
  ProofreaderActivity
} from '../../interfaces/proofreaderActivities'

describe('ProofreaderPassageApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const url = `${questionApiBaseUrl}.json?question_type=${PROOFREADER_PASSAGE_TYPE}`
      ProofreaderPassageApi.getAll()
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_ID = 'id'
      const url = `${questionApiBaseUrl}/${MOCK_ID}.json`
      ProofreaderPassageApi.get(MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_CONTENT : ProofreaderActivity = {
        description: 'test',
        title: 'test',
        passage: 'test',
        standard: { 
          name: 'test',
          uid: 'test',
        },
        standardLevel: { 
          name: 'test',
          uid: 'test',
        },
        topicCategory: {
          name: 'test',
          uid: 'test',
        },
        underlineErrorsInProofreader: true, 
        flag: 'alpha',
      }
      const url = `${questionApiBaseUrl}.json?question_type=${PROOFREADER_PASSAGE_TYPE}`
      ProofreaderPassageApi.create(MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, {question: MOCK_CONTENT})
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 'id'
      const MOCK_CONTENT : ProofreaderActivity = {
        description: 'test',
        title: 'test',
        passage: 'test',
        standard: { 
          name: 'test',
          uid: 'test',
        },
        standardLevel: { 
          name: 'test',
          uid: 'test',
        },
        topicCategory: {
          name: 'test',
          uid: 'test',
        },
        underlineErrorsInProofreader: true, 
        flag: 'alpha',
      }
      const url = `${questionApiBaseUrl}/${MOCK_ID}.json`
      ProofreaderPassageApi.update(MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {question: MOCK_CONTENT})
    })
  })
})
