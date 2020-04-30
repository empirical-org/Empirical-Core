import { requestDelete, requestGet, requestPost, requestPut } from './request';
import { ProofreaderActivity, ProofreaderActivities } from '../interfaces/proofreaderActivities';

const PROOFREADER_PASSAGE_TYPE = 'proofreader_passage'

const questionApiBaseUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/questions`;

class ProofreaderPassageApi {
  static getAll(): Promise<Array<ProofreaderActivity>> {
    return requestGet(`${questionApiBaseUrl}.json?question_type=${PROOFREADER_PASSAGE_TYPE}`);
  }

  static get(uid: string): Promise<ProofreaderActivity> {
    return requestGet(`${questionApiBaseUrl}/${uid}.json`);
  }

  static create(data: ProofreaderActivity): Promise<ProofreaderActivities> {
    return requestPost(`${questionApiBaseUrl}.json?question_type=${PROOFREADER_PASSAGE_TYPE}`, {question: data});
  }

  static update(uid: string, data: ProofreaderActivity): Promise<ProofreaderActivity> {
    return requestPut(`${questionApiBaseUrl}/${uid}.json`, {question: data});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${questionApiBaseUrl}/${uid}.json`);
  }
}

export {
  ProofreaderPassageApi,
  PROOFREADER_PASSAGE_TYPE,
  questionApiBaseUrl
}
