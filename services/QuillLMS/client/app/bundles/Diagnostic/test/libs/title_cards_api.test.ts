import {
  mockRequestGet,
  mockRequestPost,
  mockRequestPut
} from '../__mocks__/request_wrapper'
jest.mock('../../../../modules/request/index', () => ({
  requestGet: mockRequestGet,
  requestPost: mockRequestPost,
  requestPut: mockRequestPut,
}))

import {
  TitleCardApi,
  titleCardApiBaseUrl
} from '../../libs/title_cards_api'

import {
  TitleCard
} from '../../interfaces/title_cards'

describe('TitleCardApi calls', () => {
  describe('getAll', () => {
    it('should call requestGet', () => {
      const MOCK_TYPE = 'TYPE'
      const url = `${titleCardApiBaseUrl}.json?title_card_type=${MOCK_TYPE}`
      TitleCardApi.getAll(MOCK_TYPE)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url, null, expect.anything())
    })
  })

  describe('get', () => {
    it('should call requestGet', () => {
      const MOCK_TYPE = 'TYPE'
      const MOCK_ID = 'id'
      const url = `${titleCardApiBaseUrl}/${MOCK_ID}.json?title_card_type=${MOCK_TYPE}`
      TitleCardApi.get(MOCK_TYPE, MOCK_ID)
      expect(mockRequestGet).toHaveBeenLastCalledWith(url, null, expect.anything())
    })
  })

  describe('create', () => {
    it('should call requestPost', () => {
      const MOCK_TYPE = 'TYPE'
      const MOCK_CONTENT : TitleCard = {
        content: 'test',
        title: 'test',
        uid: 'test'
      }
      const url = `${titleCardApiBaseUrl}.json?title_card_type=${MOCK_TYPE}`
      TitleCardApi.create(MOCK_TYPE, MOCK_CONTENT)
      expect(mockRequestPost).toHaveBeenLastCalledWith(url, {title_card: MOCK_CONTENT}, null, expect.anything())
    })
  })

  describe('update', () => {
    it('should call requestPut', () => {
      const MOCK_TYPE = 'TYPE'
      const MOCK_ID = 'id'
      const MOCK_CONTENT : TitleCard = {
        content: 'test',
        title: 'test',
        uid: 'test'
      }
      const url = `${titleCardApiBaseUrl}/${MOCK_ID}.json?title_card_type=${MOCK_TYPE}`
      TitleCardApi.update(MOCK_TYPE, MOCK_ID, MOCK_CONTENT)
      expect(mockRequestPut).toHaveBeenLastCalledWith(url, {title_card: MOCK_CONTENT}, null, expect.anything())
    })
  })
})
