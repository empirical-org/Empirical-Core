import { mockGrammarActivityApi } from '../__mocks__/grammar_activity_api'
jest.mock('../../libs/grammar_activities_api', () => ({
  GrammarActivityApi: mockGrammarActivityApi,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import * as grammarActions from '../../actions/grammarActivities'

describe('GrammarActivities actions', () => {
  describe('startListeningToActivities', () => {
    it('should call ProofreaderPassageApi.getAll()', () => {
      dispatch(grammarActions.startListeningToActivities())
      expect(mockGrammarActivityApi.getAll).toHaveBeenCalled()
    })
  })

  describe('getActivity', () => {
    it('should call ProofreaderPassageApi.get()', () => {
      const MOCK_UID = 'UID'
      dispatch(grammarActions.getActivity(MOCK_UID))
      expect(mockGrammarActivityApi.get).toHaveBeenLastCalledWith(MOCK_UID)
    })
  })

  describe('submitNewLesson', () => {
    it('should call ProofreaderPassageApi.create()', () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(grammarActions.submitNewLesson(MOCK_CONTENT))
      expect(mockGrammarActivityApi.create).toHaveBeenLastCalledWith(MOCK_CONTENT)
    })
  })

  describe('submitLessonEdit', () => {
    it('should call ProofreaderPassageApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(grammarActions.submitLessonEdit(MOCK_ID, MOCK_CONTENT))
      expect(mockGrammarActivityApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('deleteLesson', () => {
    it('should call ProofreaderPassageApi.remove()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(grammarActions.deleteLesson(MOCK_ID))
      expect(mockGrammarActivityApi.remove).toHaveBeenLastCalledWith(MOCK_ID)
    })
  })
})
