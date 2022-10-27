import { requestDelete, requestGet, requestPost, requestPut } from '../../../modules/request/index';
import { ProofreaderActivity, ProofreaderActivities } from '../interfaces/proofreaderActivities';

const PROOFREADER_PASSAGE_TYPE = 'proofreader_passage'

const lessonApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/lessons`;

class ProofreaderPassageApi {
  static getAll(): Promise<Array<ProofreaderActivity>> {
    return requestGet(`${lessonApiBaseUrl}.json?lesson_type=${PROOFREADER_PASSAGE_TYPE}`);
  }

  static get(uid: string): Promise<ProofreaderActivity> {
    return requestGet(`${lessonApiBaseUrl}/${uid}.json`);
  }

  static create(data: ProofreaderActivity): Promise<ProofreaderActivities> {
    return requestPost(`${lessonApiBaseUrl}.json?lesson_type=${PROOFREADER_PASSAGE_TYPE}`, {lesson: data});
  }

  static update(uid: string, data: ProofreaderActivity): Promise<ProofreaderActivity> {
    return requestPut(`${lessonApiBaseUrl}/${uid}.json`, {lesson: data});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${lessonApiBaseUrl}/${uid}.json`);
  }
}

export {
  ProofreaderPassageApi,
  PROOFREADER_PASSAGE_TYPE,
  lessonApiBaseUrl
}
