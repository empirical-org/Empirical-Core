import { requestDelete, requestGet, requestPost, requestPut } from './request';

const sessionApiBaseUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/active_activity_sessions`;

class SessionApi {
  static get(uid: string): Promise<object> {
    return requestGet(`${sessionApiBaseUrl}/${uid}.json`);
  }

  static create(questionType: string, data: object): Promise<Array<object>> {
    return requestPost(`${sessionApiBaseUrl}.json`, {question: data});
  }

  static update(uid: string, data: object): Promise<object> {
    return requestPut(`${sessionApiBaseUrl}/${uid}.json`, {question: data});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${sessionApiBaseUrl}/${uid}.json`);
  }
}

export {
  SessionApi,
  sessionApiBaseUrl
}
