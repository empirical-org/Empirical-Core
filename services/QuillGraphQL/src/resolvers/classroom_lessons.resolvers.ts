import rethinkClient from '../utils/rethinkdb';

export default {
  Query: {
    classroomLesson: classroomLesson,
    classroomLessons: classroomLessonsIndex
  }
}

function classroomLessonsIndex(parent, args, ctx) {
  return rethinkClient.db('quill_lessons').table('classroom_lessons').run()
}

function classroomLesson(parent, {id}) {
  return rethinkClient.db('quill_lessons').table('classroom_lessons').get(id).run()
}