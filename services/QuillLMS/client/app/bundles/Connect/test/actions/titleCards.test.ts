import 'whatwg-fetch'
import { mockLessonApi } from '../__mocks__/lesson_api'
import { mockTitleCardApi } from '../__mocks__/title_card_api'
jest.mock('../../libs/title_cards_api', () => ({
  TitleCardApi: mockTitleCardApi,
}))
jest.mock('../../libs/lessons_api', () => ({
  LessonApi: mockLessonApi,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import { TYPE_CONNECT_LESSON } from '../../libs/lessons_api'
import { CONNECT_TITLE_CARD_TYPE } from '../../libs/title_cards_api'

import titleCardActions from '../../actions/titleCards'

describe('TitleCards actions', () => {
  describe('startListeningToTitleCards', () => {
    it('should call TitleCardApi.getAll()', () => {
      dispatch(titleCardActions.startListeningToTitleCards())
      expect(mockTitleCardApi.getAll).toHaveBeenLastCalledWith(CONNECT_TITLE_CARD_TYPE)
    })
  })

  describe('loadTitleCards', () => {
    it('should call TitleCardApi.getAll()', () => {
      dispatch(titleCardActions.loadTitleCards())
      expect(mockTitleCardApi.getAll).toHaveBeenLastCalledWith(CONNECT_TITLE_CARD_TYPE)
    })
  })

  describe('loadSpecifiedTitleCards', () => {
    it('should call TitleCardApi.get()', () => {
      const MOCK_ID1 = '1'
      const MOCK_ID2 = '2'
      const MOCK_IDS = [MOCK_ID1, MOCK_ID2]
      dispatch(titleCardActions.loadSpecifiedTitleCards(MOCK_IDS))
      expect(mockTitleCardApi.get).toHaveBeenCalledWith(CONNECT_TITLE_CARD_TYPE, MOCK_ID1)
      expect(mockTitleCardApi.get).toHaveBeenCalledWith(CONNECT_TITLE_CARD_TYPE, MOCK_ID2)
    })
  })

  describe('submitNewTitleCard', () => {
    it('should call TitleCardApi.create()', () => {
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(titleCardActions.submitNewTitleCard(MOCK_CONTENT, "", "abc123"))
      expect(mockTitleCardApi.create).toHaveBeenLastCalledWith(CONNECT_TITLE_CARD_TYPE, MOCK_CONTENT)
    })

    it('should call LessonApi.addQuestion() if lessonID is present', async () => {
      const MOCK_CONTENT = { mock: 'content', answers: [] }
      const MOCK_LESSON_ID = "lessonID"
      const MOCK_LESSON_QUESTION = {"key": "uid", "questionType": "titleCards"}
      dispatch(titleCardActions.submitNewTitleCard(MOCK_CONTENT, {}, MOCK_LESSON_ID))
      await titleCardActions.submitNewTitleCard(MOCK_CONTENT, {}, MOCK_LESSON_ID)
      expect(mockLessonApi.addQuestion).toHaveBeenLastCalledWith(TYPE_CONNECT_LESSON, MOCK_LESSON_ID, MOCK_LESSON_QUESTION)
    })
  })

  describe('submitTitleCardEdit', () => {
    it('should call TitleCardApi.update()', () => {
      const MOCK_ID = 1
      const MOCK_CONTENT = { mock: 'content' }
      dispatch(titleCardActions.submitTitleCardEdit(MOCK_ID, MOCK_CONTENT))
      expect(mockTitleCardApi.update).toHaveBeenLastCalledWith(CONNECT_TITLE_CARD_TYPE, MOCK_ID, MOCK_CONTENT)
    })
  })
})
