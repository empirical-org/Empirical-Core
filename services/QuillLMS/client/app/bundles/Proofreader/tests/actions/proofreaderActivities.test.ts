import { mockProofreaderPassageApi } from '../__mocks__/proofreader_passage_api'
jest.mock('../../lib/proofreader_activities_api', () => ({
  ProofreaderPassageApi: mockProofreaderPassageApi,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import * as proofreaderActions from '../../actions/proofreaderActivities'

describe('ProofreaderActivities actions', () => {
  describe('startListeningToActivities', () => {
    it('should call ProofreaderPassageApi.getAll()', () => {
      dispatch(proofreaderActions.startListeningToActivities())
      expect(mockProofreaderPassageApi.getAll).toHaveBeenCalled()
    })
  })

  describe('getActivity', () => {
    it('should call ProofreaderPassageApi.get()', () => {
      const MOCK_UID = 'UID'
      dispatch(proofreaderActions.getActivity(MOCK_UID))
      expect(mockProofreaderPassageApi.get).toHaveBeenLastCalledWith(MOCK_UID)
    })
  })

  describe('submitNewLesson', () => {
    it('should call ProofreaderPassageApi.create()', () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(proofreaderActions.submitNewLesson(MOCK_CONTENT))
      expect(mockProofreaderPassageApi.create).toHaveBeenLastCalledWith(MOCK_CONTENT)
    })
  })

  describe('submitLessonEdit', () => {
    it('should call ProofreaderPassageApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(proofreaderActions.submitLessonEdit(MOCK_ID, MOCK_CONTENT))
      expect(mockProofreaderPassageApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('deleteLesson', () => {
    it('should call ProofreaderPassageApi.remove()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(proofreaderActions.deleteLesson(MOCK_ID))
      expect(mockProofreaderPassageApi.remove).toHaveBeenLastCalledWith(MOCK_ID)
    })
  })
})
