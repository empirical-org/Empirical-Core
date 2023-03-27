import { mockFocusPointApi } from '../__mocks__/focus_point_api'
import { mockIncorrectSequenceApi } from '../__mocks__/incorrect_sequence_api'
import { mockQuestionApi } from '../__mocks__/question_api'
jest.mock('../../libs/questions_api', () => ({
  FocusPointApi: mockFocusPointApi,
  IncorrectSequenceApi: mockIncorrectSequenceApi,
  QuestionApi: mockQuestionApi,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import {
    GRAMMAR_QUESTION_TYPE
} from '../../libs/questions_api'

import {
    deleteFocusPoint, deleteIncorrectSequence, getQuestion, startListeningToQuestions, submitBatchEditedFocusPoint, submitEditedFocusPoint, submitEditedIncorrectSequence, submitNewFocusPoint, submitNewIncorrectSequence, submitNewQuestion,
    submitQuestionEdit, updateFlag, updateIncorrectSequences
} from '../../actions/questions'

describe('Questions actions', () => {
  describe('startListeningToQuestions', () => {
    it('should call QuestionApi.getAll()', () => {
      dispatch(startListeningToQuestions())
      expect(mockQuestionApi.getAll).toHaveBeenLastCalledWith(GRAMMAR_QUESTION_TYPE)
    })
  })

  describe('getQuestion', () => {
    it('should call QuestionApi.get()', () => {
      const MOCK_ID = 1
      dispatch(getQuestion(MOCK_ID))
      expect(mockQuestionApi.get).toHaveBeenLastCalledWith(MOCK_ID)
    })
  })

  describe('updateFlag', () => {
    it('should call QuestionApi.updateFlag()', () => {
      const MOCK_ID = 1
      const MOCK_FLAG = 'FLAG'
      dispatch(updateFlag(MOCK_ID, MOCK_FLAG))
      expect(mockQuestionApi.updateFlag).toHaveBeenLastCalledWith(MOCK_ID, MOCK_FLAG)
    })
  })

  describe('submitNewQuestion', () => {
    it('should call QuestionApi.getAll()', () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(submitNewQuestion(MOCK_CONTENT))
      expect(mockQuestionApi.create).toHaveBeenLastCalledWith(GRAMMAR_QUESTION_TYPE, MOCK_CONTENT)
    })
  })

  describe('submitQuestionEdit', () => {
    it('should call QuestionApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      const MOCK_STATE = () => ({
        questions: { data: { [MOCK_ID]: {} } }
      })
      dispatch(submitQuestionEdit(MOCK_ID, MOCK_CONTENT), MOCK_STATE)
      expect(mockQuestionApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('submitNewIncorrectSequence', () => {
    it('should call IncorrectSequenceApi.create()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(submitNewIncorrectSequence(MOCK_ID, MOCK_CONTENT))
      expect(mockIncorrectSequenceApi.create).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('submitEditedIncorrectSequence', () => {
    it('should call IncorrectSequenceApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      const MOCK_IS_ID = 2
      dispatch(submitEditedIncorrectSequence(MOCK_ID, MOCK_CONTENT, MOCK_IS_ID))
      expect(mockIncorrectSequenceApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_IS_ID, MOCK_CONTENT)
    })
  })

  describe('deleteIncorrectSequence', () => {
    it('should call IncorrectSequenceApi.remove()', () => {
      const MOCK_ID = 1
      const MOCK_IS_ID = 2
      dispatch(deleteIncorrectSequence(MOCK_ID, MOCK_IS_ID))
      expect(mockIncorrectSequenceApi.remove).toHaveBeenLastCalledWith(MOCK_ID, MOCK_IS_ID)
    })
  })

  describe('updateIncorrectSequences', () => {
    it('should call IncorrectSequenceApi.updateAllForQuestion()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(updateIncorrectSequences(MOCK_ID, MOCK_CONTENT))
      expect(mockIncorrectSequenceApi.updateAllForQuestion).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('submitNewFocusPoint', () => {
    it('should call FocusPointApi.create()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(submitNewFocusPoint(MOCK_ID, MOCK_CONTENT))
      expect(mockFocusPointApi.create).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('submitEditedFocusPoint', () => {
    it('should call FocusPointApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      const MOCK_IS_ID = 2
      dispatch(submitEditedFocusPoint(MOCK_ID, MOCK_CONTENT, MOCK_IS_ID))
      expect(mockFocusPointApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_IS_ID, MOCK_CONTENT)
    })
  })

  describe('deleteFocusPoint', () => {
    it('should call FocusPointApi.remove()', () => {
      const MOCK_ID = 1
      const MOCK_IS_ID = 2
      dispatch(deleteFocusPoint(MOCK_ID, MOCK_IS_ID))
      expect(mockFocusPointApi.remove).toHaveBeenLastCalledWith(MOCK_ID, MOCK_IS_ID)
    })
  })

  describe('submitBatchEditedFocusPoint', () => {
    it('should call FocusPointApi.updateAllForQuestion()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(submitBatchEditedFocusPoint(MOCK_ID, MOCK_CONTENT))
      expect(mockFocusPointApi.updateAllForQuestion).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })
})
