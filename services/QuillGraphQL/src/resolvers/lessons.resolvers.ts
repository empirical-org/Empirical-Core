import * as request from 'superagent'
import {
  embedIdInFirebaseObject,
  convertFirebaseIndexToFirebaseCollection
} from '../utils/firebase'
declare interface Lesson {
  flag: string
  introURL: string
  name: string
  id?: string
}

export default {
  Query: {
    lesson: (_, {id}) => getLesson(id),
    lessons: getLessons
  }
}

function getLesson(id: string) {
  return request
    .get(`${process.env.FIREBASE_URL}/v2/lessons/${id}.json`)
    .then((res) => {
      const val = embedIdInFirebaseObject(res.body, id);
      return res.body;
    });
}

function getLessons() {
  return request
    .get(`${process.env.FIREBASE_URL}/v2/lessons.json`)
    .then((res) => {
      return convertFirebaseIndexToFirebaseCollection(res.body)
    });
}
 