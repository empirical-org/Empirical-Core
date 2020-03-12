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
  QuestionApi,
  FocusPointApi,
  IncorrectSequenceApi,
  questionApiBaseUrl,
} from '../../libs/questions_api'

describe('QuestionApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const MOCK_TYPE = 'TYPE'
      const url = `${questionApiBaseUrl}.json?question_type=${MOCK_TYPE}`
      QuestionApi.getAll(MOCK_TYPE)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_ID = 1
      const url = `${questionApiBaseUrl}/${MOCK_ID}.json`
      QuestionApi.get(MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_TYPE = 'TYPE'
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${questionApiBaseUrl}.json?question_type=${MOCK_TYPE}`
      QuestionApi.create(MOCK_TYPE, MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, {question: MOCK_CONTENT})
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${questionApiBaseUrl}/${MOCK_ID}.json`
      QuestionApi.update(MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {question: MOCK_CONTENT})
    })
  })

  describe('updateFlag', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 1
      const MOCK_FLAG = 'FLAG'
      const url = `${questionApiBaseUrl}/${MOCK_ID}/update_flag.json`
      QuestionApi.updateFlag(MOCK_ID, MOCK_FLAG)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {question: {
        flag: MOCK_FLAG
      }})
    })
  })

  describe('updateModelConcept', () => {
    it('should call requestPut', () => {
      const MOCK_ID = 1
      const MOCK_CONCEPT_UID = 'UID'
      const url = `${questionApiBaseUrl}/${MOCK_ID}/update_model_concept.json`
      QuestionApi.updateModelConcept(MOCK_ID, MOCK_CONCEPT_UID)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {question: {
        modelConcept: MOCK_CONCEPT_UID
      }})
    })
  })
})

describe('FocusPointApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const MOCK_QUESTION_ID = 1
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/focus_points.json`
      FocusPointApi.getAll(MOCK_QUESTION_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_FP_ID = 2
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/focus_points/${MOCK_FP_ID}.json`
      FocusPointApi.get(MOCK_QUESTION_ID, MOCK_FP_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/focus_points.json`
      FocusPointApi.create(MOCK_QUESTION_ID, MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, { focus_point: MOCK_CONTENT })
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_FP_ID = 2
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/focus_points/${MOCK_FP_ID}.json`
      FocusPointApi.update(MOCK_QUESTION_ID, MOCK_FP_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, { focus_point: MOCK_CONTENT })
    })
  })

  describe('updateAllForQuestion', () => {
    it('should call requestPut', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/focus_points/update_all.json`
      FocusPointApi.updateAllForQuestion(MOCK_QUESTION_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, { focus_point: MOCK_CONTENT })
    })
  })

  describe('remove', () => {
    it('should call requestDelete', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_FP_ID = 2
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/focus_points/${MOCK_FP_ID}.json`
      FocusPointApi.remove(MOCK_QUESTION_ID, MOCK_FP_ID)
      expect(mockRequestDelete).toHaveBeenLastCalledWith(url)
    })
  })
})

describe('IncorrectSequenceApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const MOCK_QUESTION_ID = 1
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/incorrect_sequences.json`
      IncorrectSequenceApi.getAll(MOCK_QUESTION_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_IS_ID = 2
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/incorrect_sequences/${MOCK_IS_ID}.json`
      IncorrectSequenceApi.get(MOCK_QUESTION_ID, MOCK_IS_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url)
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/incorrect_sequences.json`
      IncorrectSequenceApi.create(MOCK_QUESTION_ID, MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, { incorrect_sequence: MOCK_CONTENT })
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_IS_ID = 2
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/incorrect_sequences/${MOCK_IS_ID}.json`
      IncorrectSequenceApi.update(MOCK_QUESTION_ID, MOCK_IS_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, { incorrect_sequence: MOCK_CONTENT })
    })
  })

  describe('updateAllForQuestion', () => {
    it('should call requestPut', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_CONTENT = { foo: 'bar' }
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/incorrect_sequences/update_all.json`
      IncorrectSequenceApi.updateAllForQuestion(MOCK_QUESTION_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, { incorrect_sequence: MOCK_CONTENT })
    })
  })

  describe('remove', () => {
    it('should call requestDelete', () => {
      const MOCK_QUESTION_ID = 1
      const MOCK_IS_ID = 2
      const url = `${questionApiBaseUrl}/${MOCK_QUESTION_ID}/incorrect_sequences/${MOCK_IS_ID}.json`
      IncorrectSequenceApi.remove(MOCK_QUESTION_ID, MOCK_IS_ID)
      expect(mockRequestDelete).toHaveBeenLastCalledWith(url)
    })
  })
})
