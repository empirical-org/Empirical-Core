import * as request from 'superagent'

declare interface Lesson {
  flag: string
  introURL: string
  name: string
  id?: string
}

export default {
  Query: {
    lesson: (_, {id}) => {return getLesson(id)},
    lessons: () => getLessons()
  }
}

function getLesson(id: string) {
  request
    .get(`${process.env.FIREBASE_URL}/v2/lessons/${id}.json`)
    .end((err, res) => {
      const val = embedIDInLesson(res.body, id);
      console.log(val);
      return val;
    });
}

function getLessons() {
  request
    .get(`${process.env.FIREBASE_URL}/v2/lessons.json`)
    .end((err, res) => {
      return res.body
    });
}

function embedIDInLesson(lesson: Lesson, id: string):Lesson {
  return Object.assign({}, lesson, {id});
}