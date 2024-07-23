import 'whatwg-fetch';
import { mockFocusPointApi, } from '../__mocks__/focus_point_api';
import { mockIncorrectSequenceApi, } from '../__mocks__/incorrect_sequence_api';
import { mockLessonApi, } from '../__mocks__/lesson_api';
import { mockQuestionApi, } from '../__mocks__/question_api';
import { mockDispatch as dispatch, } from '../__mocks__/dispatch';
import { TYPE_CONNECT_LESSON } from '../../libs/lessons_api';
import { SENTENCE_COMBINING_TYPE } from '../../libs/questions_api';
import questionActions from '../../actions/questions';

jest.mock('../../libs/questions_api', () => ({
  FocusPointApi: mockFocusPointApi,
  IncorrectSequenceApi: mockIncorrectSequenceApi,
  QuestionApi: mockQuestionApi,
}))
jest.mock('../../libs/lessons_api', () => ({
  LessonApi: mockLessonApi,
}))

describe('Questions actions', () => {
  describe('startListeningToQuestions', () => {
    it('should call QuestionApi.getAll()', () => {
      dispatch(questionActions.startListeningToQuestions())
      expect(mockQuestionApi.getAll).toHaveBeenLastCalledWith(SENTENCE_COMBINING_TYPE)
    })
  })

  describe('loadQuestions', () => {
    it('should call QuestionApi.getAll()', () => {
      dispatch(questionActions.loadQuestions())
      expect(mockQuestionApi.getAll).toHaveBeenLastCalledWith(SENTENCE_COMBINING_TYPE)
    })
  })

  describe('loadSpecifiedQuestions', () => {
    it('should call QuestionApi.get()', () => {
      const MOCK_ID1 = '1'
      const MOCK_ID2 = '2'
      const MOCK_IDS = [MOCK_ID1, MOCK_ID2]
      dispatch(questionActions.loadSpecifiedQuestions(MOCK_IDS))
      expect(mockQuestionApi.get).toHaveBeenCalledWith(MOCK_ID1)
      expect(mockQuestionApi.get).toHaveBeenCalledWith(MOCK_ID2)
    })
  })

  describe('updateFlag', () => {
    it('should call QuestionApi.updateFlag()', () => {
      const MOCK_ID = 'id'
      const MOCK_FLAG = 'FLAG'
      dispatch(questionActions.updateFlag(MOCK_ID, MOCK_FLAG))
      expect(mockQuestionApi.updateFlag).toHaveBeenLastCalledWith(MOCK_ID, MOCK_FLAG)
    })
  })

  describe('submitNewQuestion', () => {
    it('should call QuestionApi.create()', () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(questionActions.submitNewQuestion(MOCK_CONTENT, {}, "123abc"))
      expect(mockQuestionApi.create).toHaveBeenLastCalledWith(SENTENCE_COMBINING_TYPE, MOCK_CONTENT)
    })

    it('should call LessonApi.addQuestion() if lessonID is present', async () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      const MOCK_LESSON_ID = "lessonID"
      const MOCK_LESSON_QUESTION = {"key": "question", "questionType": "questions"}
      dispatch(questionActions.submitNewQuestion(MOCK_CONTENT, {}, MOCK_LESSON_ID))
      await questionActions.submitNewQuestion(MOCK_CONTENT, {}, MOCK_LESSON_ID)
      expect(mockLessonApi.addQuestion).toHaveBeenLastCalledWith(TYPE_CONNECT_LESSON, MOCK_LESSON_ID, MOCK_LESSON_QUESTION)
    })
  })

  describe('submitQuestionEdit', () => {
    it('should call QuestionApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(questionActions.submitQuestionEdit(MOCK_ID, MOCK_CONTENT))
      expect(mockQuestionApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('submitNewIncorrectSequence', () => {
    it('should call IncorrectSequenceApi.create()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(questionActions.submitNewIncorrectSequence(MOCK_ID, MOCK_CONTENT, jest.fn()))
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

  describe('updateIncorrectSequences', () => {
    it('should call IncorrectSequenceApi.updateAllForQuestion()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(questionActions.updateIncorrectSequences(MOCK_ID, MOCK_CONTENT))
      expect(mockIncorrectSequenceApi.updateAllForQuestion).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
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
