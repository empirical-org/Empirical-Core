import { mockLessonApi } from '../__mocks__/lesson_api'
const MOCK_LESSON_TYPE = 'TYPE'
jest.mock('../../libs/lessons_api', () => ({
  LessonApi: mockLessonApi,
  TYPE_DIAGNOSTIC_LESSON: MOCK_LESSON_TYPE,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import lessonActions from '../../actions/lessons'

describe('Lessons actions', () => {
  describe('startListeningToLessons', () => {
    it('should call LessonsApi.getAll()', () => {
      dispatch(lessonActions.startListeningToLessons())
      expect(mockLessonApi.getAll).toHaveBeenCalledWith(MOCK_LESSON_TYPE)
    })
  })

  describe('submitNewLesson', () => {
    it('should call LessonApi.create()', () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(lessonActions.submitNewLesson(MOCK_CONTENT))
      expect(mockLessonApi.create).toHaveBeenLastCalledWith(MOCK_LESSON_TYPE, MOCK_CONTENT)
    })
  })

  describe('submitLessonEdit', () => {
    it('should call LessonApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      const MOCK_QIDS = ['jakjsh3', '3quhdbds', '3qe8yvas']
      dispatch(lessonActions.submitLessonEdit(MOCK_ID, MOCK_CONTENT, MOCK_QIDS))
      expect(mockLessonApi.update).toHaveBeenLastCalledWith(MOCK_LESSON_TYPE, MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('deleteLesson', () => {
    it('should call LessonApi.remove()', () => {
      const MOCK_ID = '1'
      dispatch(lessonActions.deleteLesson(MOCK_ID))
      expect(mockLessonApi.remove).toHaveBeenLastCalledWith(MOCK_LESSON_TYPE, MOCK_ID)
    })
  })

  describe('loadLesson', () => {
    it('should call LessonApi.get()', () => {
      const MOCK_ID = '1'
      dispatch(lessonActions.loadLesson(MOCK_ID))
      expect(mockLessonApi.get).toHaveBeenLastCalledWith(MOCK_LESSON_TYPE, MOCK_ID)
    })
  })

  describe('loadLessons', () => {
    it('should call LessonsApi.getAll()', () => {
      dispatch(lessonActions.loadLessons())
      expect(mockLessonApi.getAll).toHaveBeenCalledWith(MOCK_LESSON_TYPE)
    })
  })

  describe('loadLessonsWithQuestions', () => {
    it('should call LessonApi.get()', () => {
      const MOCK_ID = '1'
      dispatch(lessonActions.loadLesson(MOCK_ID))
      expect(mockLessonApi.get).toHaveBeenLastCalledWith(MOCK_LESSON_TYPE, MOCK_ID)
    })
  })
})
