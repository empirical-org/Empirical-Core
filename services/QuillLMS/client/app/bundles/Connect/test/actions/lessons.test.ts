import 'whatwg-fetch'
import { mockLessonApi, } from '../__mocks__/lesson_api'
import configureStore from 'redux-mock-store';
const MOCK_LESSON_TYPE = 'TYPE'
jest.mock('../../libs/lessons_api', () => ({
  LessonApi: mockLessonApi,
  TYPE_CONNECT_LESSON: MOCK_LESSON_TYPE,
}))

import { mockDispatch as dispatch, } from '../__mocks__/dispatch'

import lessonActions from '../../actions/lessons'

describe('Lessons actions', () => {
  const mockStore = configureStore();
  const store = mockStore();

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
      const MOCK_QIDS = ['1', '2', '3']
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

  describe('setLessonFlag', () => {
    const expectedActions = [{
      'type': 'SET_LESSON_FLAG',
      'flag': 'production'
    }
    ]
    store.dispatch(expectedActions[0])
    expect(store.getActions()).toEqual(expectedActions);
  })
})
