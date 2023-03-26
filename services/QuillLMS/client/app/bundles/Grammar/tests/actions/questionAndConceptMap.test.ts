import { mockSharedCacheApi } from '../__mocks__/shared_cache_api'
jest.mock('../../libs/shared_cache_api', () => ({
  SharedCacheApi: mockSharedCacheApi,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import {
    checkTimeout,
    SHARED_CACHE_KEY, startListeningToQuestionAndConceptMapData
} from '../../actions/questionAndConceptMap'

describe('QuestionAndConceptMap actions', () => {
  describe('startListeningToQuestionAndConceptMapData', () => {
    it('should call SharedCacheApi.get()', () => {
      dispatch(startListeningToQuestionAndConceptMapData())
      expect(mockSharedCacheApi.get).toHaveBeenLastCalledWith(SHARED_CACHE_KEY)
    })
  })

  describe('checkTimeout', () => {
    it('should call SharedCacheApi.get()', () => {
      dispatch(checkTimeout())
      expect(mockSharedCacheApi.get).toHaveBeenLastCalledWith(SHARED_CACHE_KEY)
    })
  })
})
