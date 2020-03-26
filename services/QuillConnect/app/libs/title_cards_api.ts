import { requestGet, requestPost, requestPut } from './request';

const titleCardApiBaseUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/title_cards`;
const titleCardType = 'connect_title_card';

interface TitleCardProps {
  uid: string;
  content: string;
  title: string;
}

interface TitleCardBatchProps {
  title_cards: TitleCardProps[];
}

class TitleCardApi {
  static getAll(): Promise<TitleCardBatchProps> {
    return requestGet(`${titleCardApiBaseUrl}.json?title_card_type=${titleCardType}`);
  }

  static get(uid: string): Promise<TitleCardProps> {
    return requestGet(`${titleCardApiBaseUrl}/${uid}.json`);
  }

  static create(data: TitleCardProps): Promise<TitleCardProps> {
    return requestPost(`${titleCardApiBaseUrl}.json?title_card_type=${titleCardType}`, data);
  }

  static update(uid: string, data: TitleCardProps): Promise<TitleCardProps> {
    return requestPut(`${titleCardApiBaseUrl}/${uid}.json`, data);
  }
}
