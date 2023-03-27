import { mockTitleCardApi } from '../__mocks__/title_card_api'
jest.mock('../../libs/title_cards_api', () => ({
  TitleCardApi: mockTitleCardApi,
}))

import { mockDispatch as dispatch } from '../__mocks__/dispatch'

import { CONNECT_TITLE_CARD_TYPE } from '../../libs/title_cards_api'

import * as titleCardActions from '../../actions/titleCards'

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
      dispatch(titleCardActions.submitNewTitleCard(MOCK_CONTENT))
      expect(mockTitleCardApi.create).toHaveBeenLastCalledWith(CONNECT_TITLE_CARD_TYPE, MOCK_CONTENT)
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
