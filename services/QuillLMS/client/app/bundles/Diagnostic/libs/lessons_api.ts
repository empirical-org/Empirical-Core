import { requestDelete, requestGet, requestPost, requestPut } from '../../../modules/request/index';
import { Lesson, Lessons } from '../interfaces/lessons';

const lessonApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/lessons`;

const TYPE_CONNECT_LESSON = 'connect_lesson'
const TYPE_DIAGNOSTIC_LESSON = 'diagnostic_lesson'

class LessonApi {
  static getAll(lesson_type: string): Promise<Lessons> {
    return requestGet(`${lessonApiBaseUrl}.json?lesson_type=${lesson_type}`);
  }

  static get(lesson_type: string, uid: string): Promise<Lesson> {
    return requestGet(`${lessonApiBaseUrl}/${uid}.json`);
  }

  static create(lesson_type: string, data: Lesson): Promise<Lesson> {
    return requestPost(`${lessonApiBaseUrl}.json?lesson_type=${lesson_type}`, {lesson: data});
  }

  static update(lesson_type: string, uid: string, data: Lesson): Promise<Lesson> {
    return requestPut(`${lessonApiBaseUrl}/${uid}.json`, {lesson: data});
  }

  static remove(lesson_type: string, uid: string): Promise<string> {
    return requestDelete(`${lessonApiBaseUrl}/${uid}.json`);
  }
}

export {
  LessonApi,
  lessonApiBaseUrl,
  TYPE_CONNECT_LESSON,
  TYPE_DIAGNOSTIC_LESSON
}
