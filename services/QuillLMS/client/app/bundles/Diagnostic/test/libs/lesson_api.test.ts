import {
  mockRequestDelete,
  mockRequestGet,
  mockRequestPost,
  mockRequestPut,
} from '../__mocks__/request_wrapper'
jest.mock('../../libs/request', () => ({
  requestDelete: mockRequestDelete,
  requestGet: mockRequestGet,
  requestPost: mockRequestPost,
  requestPut: mockRequestPut,
}))

import {
  LessonApi,
  lessonApiBaseUrl,
} from '../../libs/lessons_api'

import {
  Lesson,
} from '../../interfaces/lesson'

describe('LessonApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const MOCK_LESSON_TYPE = 'TYPE';
      const url = `${lessonApiBaseUrl}.json?lesson_type=${MOCK_LESSON_TYPE}`
      LessonApi.getAll(MOCK_LESSON_TYPE)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_LESSON_TYPE = 'TYPE';
      const MOCK_ID = 'id'
      const url = `${lessonApiBaseUrl}/${MOCK_ID}.json`
      LessonApi.get(MOCK_LESSON_TYPE, MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_LESSON_TYPE = 'TYPE';
      const MOCK_CONTENT : Lesson = {
        name: 'test',
      }
      const url = `${lessonApiBaseUrl}.json?lesson_type=${MOCK_LESSON_TYPE}`
      LessonApi.create(MOCK_LESSON_TYPE, MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, {lesson: MOCK_CONTENT})
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_LESSON_TYPE = 'TYPE';
      const MOCK_ID = 'id'
      const MOCK_CONTENT : Lesson = {
        name: 'test',
      }
      const url = `${lessonApiBaseUrl}/${MOCK_ID}.json`
      LessonApi.update(MOCK_LESSON_TYPE, MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {lesson: MOCK_CONTENT})
    })
  })

  describe('remove', () => {
    it('should call requestDelete', () => {
      const MOCK_LESSON_TYPE = 'TYPE';
      const MOCK_QUESTION_ID = 'id'
      const url = `${lessonApiBaseUrl}/${MOCK_QUESTION_ID}.json`
      LessonApi.remove(MOCK_LESSON_TYPE, MOCK_QUESTION_ID)
      expect(mockRequestDelete).toHaveBeenLastCalledWith(url)
    })
  })
})
