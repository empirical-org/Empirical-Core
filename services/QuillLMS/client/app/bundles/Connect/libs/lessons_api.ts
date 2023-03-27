import { requestDelete, requestGet, requestPost, requestPut } from '../../../modules/request/index';
import { Lesson, LessonQuestion, Lessons } from '../interfaces/lessons';

const lessonApiBaseUrl = `${import.meta.env.VITE_DEFAULT_URL}/api/v1/lessons`;

const TYPE_CONNECT_LESSON = 'connect_lesson'
const TYPE_DIAGNOSTIC_LESSON = 'diagnostic_lesson'

class LessonApi {
  static getAll(lesson_type: string): Promise<Lessons> {
    return requestGet(`${lessonApiBaseUrl}.json?lesson_type=${lesson_type}`, null, (error) => {throw(error)});
  }

  static get(lesson_type: string, uid: string): Promise<Lesson> {
    return requestGet(`${lessonApiBaseUrl}/${uid}.json`, null, (error) => {throw(error)});
  }

  static create(lesson_type: string, data: Lesson): Promise<Lesson> {
    return requestPost(`${lessonApiBaseUrl}.json?lesson_type=${lesson_type}`, {lesson: data}, null, (error) => {throw(error)});
  }

  static update(lesson_type: string, uid: string, data: Lesson): Promise<Lesson> {
    return requestPut(`${lessonApiBaseUrl}/${uid}.json`, {lesson: data}, null, (error) => {throw(error)});
  }

  static remove(lesson_type: string, uid: string): Promise<string> {
    return requestDelete(`${lessonApiBaseUrl}/${uid}.json`, null, null, (error) => {throw(error)});
  }

  static addQuestion(lesson_type: string, uid: string, question: LessonQuestion): Promise<string> {
    return requestPut(`${lessonApiBaseUrl}/${uid}/add_question.json`, {lesson_type: lesson_type, question: question}, null, (error) => {throw(error)});
  }
}

export {
    LessonApi,
    lessonApiBaseUrl,
    TYPE_CONNECT_LESSON,
    TYPE_DIAGNOSTIC_LESSON
};

