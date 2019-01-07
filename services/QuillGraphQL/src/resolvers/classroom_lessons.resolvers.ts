import rethinkClient from '../utils/rethinkdb';

export default {
  Query: {
    classroomLesson: classroomLesson,
    classroomLessons: classroomLessonsIndex
  },
  ClassroomLesson: {
    editions: editions,
    edition: edition
  }
}

function classroomLessonsIndex(parent, args, ctx) {
  return rethinkClient.db('quill_lessons').table('classroom_lessons').run()
}

function classroomLesson(parent, {id}) {
  return rethinkClient.db('quill_lessons').table('classroom_lessons').get(id).run()
}

function editions(parent, args, ctx) {
  // console.log("being called", parent, args, ctx)
  return rethinkClient.db('quill_lessons').table('lesson_edition_metadata').filter({lesson_id:  parent.id}).run()
}

function edition(parent, {id}, ctx) {
  // console.log("being called", parent, args, ctx)
  return rethinkClient.db('quill_lessons').table('lesson_edition_metadata').get(id).run()
}