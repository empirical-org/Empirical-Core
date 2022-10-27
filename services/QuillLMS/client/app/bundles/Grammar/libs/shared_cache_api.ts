import { requestDelete, requestGet, requestPut } from '../../../modules/request/index';

const sharedCacheApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/shared_cache`;

class SharedCacheApi {
  static get(uid: string): Promise<object> {
    return requestGet(`${sharedCacheApiBaseUrl}/${uid}.json`);
  }

  static update(uid: string, data: object): Promise<object> {
    return requestPut(`${sharedCacheApiBaseUrl}/${uid}.json`, {data: data});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${sharedCacheApiBaseUrl}/${uid}.json`);
  }
}

export {
  SharedCacheApi,
  sharedCacheApiBaseUrl
}
