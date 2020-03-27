import { requestDelete, requestGet, requestPost, requestPut } from './request';
import { Lesson, Lessons } from '../interfaces/lessons';

const lessonApiBaseUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/lessons`;

class LessonApi {
  static getAll(): Promise<Lessons> {
    return requestGet(`${lessonApiBaseUrl}.json`);
  }

  static get(uid: string): Promise<Lesson> {
    return requestGet(`${lessonApiBaseUrl}/${uid}.json`);
  }

  static create(data: Lesson): Promise<Lesson> {
    return requestPost(`${lessonApiBaseUrl}.json`, {lesson: data});
  }

  static update(uid: string, data: Lesson): Promise<Lesson> {
    return requestPut(`${lessonApiBaseUrl}/${uid}.json`, {lesson: data});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${lessonApiBaseUrl}/${uid}.json`);
  }
}

export {
  LessonApi,
  lessonApiBaseUrl
}
