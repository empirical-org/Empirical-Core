import { requestDelete, requestGet, requestPost, requestPut } from '../../../modules/request/index';
import { ProofreaderActivity, ProofreaderActivities } from '../interfaces/proofreaderActivities';

const PROOFREADER_PASSAGE_TYPE = 'proofreader_passage'

const lessonApiBaseUrl = `${import.meta.env.DEFAULT_URL}/api/v1/lessons`;

class ProofreaderPassageApi {
  static getAll(): Promise<Array<ProofreaderActivity>> {
    return requestGet(`${lessonApiBaseUrl}.json?lesson_type=${PROOFREADER_PASSAGE_TYPE}`, null, (error) => {throw(error)});
  }

  static get(uid: string): Promise<ProofreaderActivity> {
    return requestGet(`${lessonApiBaseUrl}/${uid}.json`, null, (error) => {throw(error)});
  }

  static create(data: ProofreaderActivity): Promise<ProofreaderActivities> {
    return requestPost(`${lessonApiBaseUrl}.json?lesson_type=${PROOFREADER_PASSAGE_TYPE}`, {lesson: data}, null, (error) => {throw(error)});
  }

  static update(uid: string, data: ProofreaderActivity): Promise<ProofreaderActivity> {
    return requestPut(`${lessonApiBaseUrl}/${uid}.json`, {lesson: data}, null, (error) => {throw(error)});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${lessonApiBaseUrl}/${uid}.json`, null, null, (error) => {throw(error)});
  }
}

export {
  ProofreaderPassageApi,
  PROOFREADER_PASSAGE_TYPE,
  lessonApiBaseUrl
}
