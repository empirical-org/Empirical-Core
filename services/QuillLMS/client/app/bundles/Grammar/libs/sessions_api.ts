import { requestGet, requestPut } from '../../../modules/request/index';

const sessionApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/active_activity_sessions`;

class SessionApi {
  static get(uid: string): Promise<object> {
    return requestGet(`${sessionApiBaseUrl}/${uid}.json`, null, (error) => {throw(error)});
  }

  static update(uid: string, data: object): Promise<object> {
    return requestPut(`${sessionApiBaseUrl}/${uid}.json`, {active_activity_session: data}, null, (error) => {throw(error)});
  }
}

export {
  SessionApi,
  sessionApiBaseUrl
}
