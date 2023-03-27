import { requestDelete, requestGet, requestPut } from '../../../modules/request/index';

const sharedCacheApiBaseUrl = `${import.meta.env.VITE_DEFAULT_URL}/api/v1/shared_cache`;

class SharedCacheApi {
  static get(uid: string): Promise<object> {
    return requestGet(`${sharedCacheApiBaseUrl}/${uid}.json`, null, (error) => {throw(error)});
  }

  static update(uid: string, data: object): Promise<object> {
    return requestPut(`${sharedCacheApiBaseUrl}/${uid}.json`, {data: data}, null, (error) => {throw(error)});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${sharedCacheApiBaseUrl}/${uid}.json`, null, null, (error) => {throw(error)});
  }
}

export {
    SharedCacheApi,
    sharedCacheApiBaseUrl
};

