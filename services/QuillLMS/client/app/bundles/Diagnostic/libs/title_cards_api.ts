import { requestGet, requestPost, requestPut } from '../../../modules/request/index';
import { TitleCard, TitleCards } from '../interfaces/title_cards';

const titleCardApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/title_cards`;
const CONNECT_TITLE_CARD_TYPE = 'connect_title_card';
const DIAGNOSTIC_TITLE_CARD_TYPE = 'diagnostic_title_card';

class TitleCardApi {
  static getAll(titleCardType: string): Promise<TitleCards> {
    return requestGet(`${titleCardApiBaseUrl}.json?title_card_type=${titleCardType}`, null, (error) => {throw(error)});
  }

  static get(titleCardType: string, uid: string): Promise<TitleCard> {
    return requestGet(`${titleCardApiBaseUrl}/${uid}.json?title_card_type=${titleCardType}`, null, (error) => {throw(error)});
  }

  static create(titleCardType: string, data: TitleCard): Promise<TitleCard> {
    return requestPost(`${titleCardApiBaseUrl}.json?title_card_type=${titleCardType}`, {title_card: data}, null, (error) => {throw(error)});
  }

  static update(titleCardType: string, uid: string, data: TitleCard): Promise<TitleCard> {
    return requestPut(`${titleCardApiBaseUrl}/${uid}.json?title_card_type=${titleCardType}`, {title_card: data}, null, (error) => {throw(error)});
  }
}

export {
  TitleCardApi,
  CONNECT_TITLE_CARD_TYPE,
  DIAGNOSTIC_TITLE_CARD_TYPE,
  titleCardApiBaseUrl
};

