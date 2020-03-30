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
  LessonApi,
  lessonApiBaseUrl,
} from '../../app/libs/lessons_api'

import {
  Lesson,
} from '../../app/interfaces/lessons'

describe('LessonApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const url = `${lessonApiBaseUrl}.json`
      LessonApi.getAll()
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_ID = 'id'
      const url = `${lessonApiBaseUrl}/${MOCK_ID}.json`
      LessonApi.get(MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_CONTENT : Lesson = {
        name: 'test',
      }
      const url = `${lessonApiBaseUrl}.json`
      LessonApi.create(MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, {lesson: MOCK_CONTENT})
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 'id'
      const MOCK_CONTENT : Lesson = {
        name: 'test',
      }
      const url = `${lessonApiBaseUrl}/${MOCK_ID}.json`
      LessonApi.update(MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {lesson: MOCK_CONTENT})
    })
  })

  describe('remove', () => {
    it('should call requestDelete', () => {
      const MOCK_QUESTION_ID = 'id'
      const url = `${lessonApiBaseUrl}/${MOCK_QUESTION_ID}.json`
      LessonApi.remove(MOCK_QUESTION_ID)
      expect(mockRequestDelete).toHaveBeenLastCalledWith(url)
    })
  })
})
