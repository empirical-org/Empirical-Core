import { mockConceptFeedbackApi } from '../__mocks__/concept_feedback_api'
jest.mock('../../libs/concept_feedback_api', () => ({
  ConceptFeedbackApi: mockConceptFeedbackApi,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import conceptFeedbackActions from '../../actions/concepts-feedback'

describe('ConceptFeedback actions', () => {
  describe('startListeningToConceptsFeedback', () => {
    it('should call ConceptFeedbackApi.getAll()', () => {
      dispatch(conceptFeedbackActions.startListeningToConceptsFeedback())
      expect(mockConceptFeedbackApi.getAll).toHaveBeenCalled()
    })
  })

  describe('submitNewConceptsFeedback', () => {
    it('should call ConceptFeedbackApi.create()', () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(conceptFeedbackActions.submitNewConceptsFeedback(MOCK_CONTENT))
      expect(mockConceptFeedbackApi.create).toHaveBeenLastCalledWith(MOCK_CONTENT)
    })
  })

  describe('submitConceptsFeedbackEdit', () => {
    it('should call ConceptFeedbackApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      dispatch(conceptFeedbackActions.submitConceptsFeedbackEdit(MOCK_ID, MOCK_CONTENT))
      expect(mockConceptFeedbackApi.update).toHaveBeenLastCalledWith(MOCK_ID, MOCK_CONTENT)
    })
  })

  describe('deleteConceptsFeedback', () => {
    it('should call ConceptFeedbackApi.remove()', () => {
      const MOCK_ID = '1'
      dispatch(conceptFeedbackActions.deleteConceptsFeedback(MOCK_ID))
      expect(mockConceptFeedbackApi.remove).toHaveBeenLastCalledWith(MOCK_ID)
    })
  })

  describe('loadConceptsFeedback', () => {
    it('should call ConceptFeedbackApi.getAll()', () => {
      dispatch(conceptFeedbackActions.loadConceptsFeedback())
      expect(mockConceptFeedbackApi.getAll).toHaveBeenCalledWith()
    })
  })
})
