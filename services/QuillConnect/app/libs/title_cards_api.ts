import { requestGet, requestPost, requestPut } from './request';
import { TitleCard, TitleCards } from '../interfaces/title_cards';

const titleCardApiBaseUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/title_cards`;
const titleCardType = 'connect_title_card';

class TitleCardApi {
  static getAll(): Promise<TitleCards> {
    return requestGet(`${titleCardApiBaseUrl}.json?title_card_type=${titleCardType}`);
  }

  static get(uid: string): Promise<TitleCard> {
    return requestGet(`${titleCardApiBaseUrl}/${uid}.json`);
  }

  static create(data: TitleCard): Promise<TitleCard> {
    return requestPost(`${titleCardApiBaseUrl}.json?title_card_type=${titleCardType}`, data);
  }

  static update(uid: string, data: TitleCard): Promise<TitleCard> {
    return requestPut(`${titleCardApiBaseUrl}/${uid}.json`, data);
  }
}
