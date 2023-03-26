import { mockFocusPointApi } from '../__mocks__/focus_point_api'
import { mockIncorrectSequenceApi } from '../__mocks__/incorrect_sequence_api'
import { mockQuestionApi } from '../__mocks__/question_api'
jest.mock('../../libs/questions_api', () => ({
  FocusPointApi: mockFocusPointApi,
  IncorrectSequenceApi: mockIncorrectSequenceApi,
  QuestionApi: mockQuestionApi,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import { SENTENCE_FRAGMENTS_TYPE } from '../../libs/questions_api'

import questionActions from '../../actions/sentenceFragments'

describe('Questions actions', () => {
  describe('startListeningToQuestions', () => {
    it('should call QuestionApi.getAll()', () => {
      dispatch(questionActions.startListeningToSentenceFragments())
      expect(mockQuestionApi.getAll).toHaveBeenLastCalledWith(SENTENCE_FRAGMENTS_TYPE)
    })
  })

  describe('submitNewQuestion', () => {
    it('should call QuestionApi.getAll()', () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(questionActions.submitNewSentenceFragment(MOCK_CONTENT, ""))
      expect(mockQuestionApi.create).toHaveBeenLastCalledWith(SENTENCE_FRAGMENTS_TYPE, MOCK_CONTENT)
    })
  })

  describe('submitQuestionEdit', () => {
    it('should call QuestionApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(questionActions.submitSentenceFragmentEdit(MOCK_ID, MOCK_CONTENT))
      expect(mockQuestionApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('submitNewIncorrectSequence', () => {
    it('should call IncorrectSequenceApi.create()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(questionActions.submitNewIncorrectSequence(MOCK_ID, MOCK_CONTENT))
      expect(mockIncorrectSequenceApi.create).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('submitEditedIncorrectSequence', () => {
    it('should call IncorrectSequenceApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      const MOCK_IS_ID = 2
      dispatch(questionActions.submitEditedIncorrectSequence(MOCK_ID, MOCK_CONTENT, MOCK_IS_ID))
      expect(mockIncorrectSequenceApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_IS_ID, MOCK_CONTENT)
    })
  })

  describe('deleteIncorrectSequence', () => {
    it('should call IncorrectSequenceApi.remove()', () => {
      const MOCK_ID = 1
      const MOCK_IS_ID = 2
      dispatch(questionActions.deleteIncorrectSequence(MOCK_ID, MOCK_IS_ID))
      expect(mockIncorrectSequenceApi.remove).toHaveBeenLastCalledWith(MOCK_ID, MOCK_IS_ID)
    })
  })

  describe('submitNewFocusPoint', () => {
    it('should call FocusPointApi.create()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(questionActions.submitNewFocusPoint(MOCK_ID, MOCK_CONTENT))
      expect(mockFocusPointApi.create).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('submitEditedFocusPoint', () => {
    it('should call FocusPointApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      const MOCK_IS_ID = 2
      dispatch(questionActions.submitEditedFocusPoint(MOCK_ID, MOCK_CONTENT, MOCK_IS_ID))
      expect(mockFocusPointApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_IS_ID, MOCK_CONTENT)
    })
  })

  describe('deleteFocusPoint', () => {
    it('should call FocusPointApi.remove()', () => {
      const MOCK_ID = 1
      const MOCK_IS_ID = 2
      dispatch(questionActions.deleteFocusPoint(MOCK_ID, MOCK_IS_ID))
      expect(mockFocusPointApi.remove).toHaveBeenLastCalledWith(MOCK_ID, MOCK_IS_ID)
    })
  })

  describe('submitBatchEditedFocusPoint', () => {
    it('should call FocusPointApi.updateAllForQuestion()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(questionActions.submitBatchEditedFocusPoint(MOCK_ID, MOCK_CONTENT))
      expect(mockFocusPointApi.updateAllForQuestion).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })
})
