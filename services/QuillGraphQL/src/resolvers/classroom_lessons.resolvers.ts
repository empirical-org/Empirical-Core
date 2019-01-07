import rethinkClient from '../utils/rethinkdb';

export default {
  Query: {
    classroomLesson: classroomLesson,
    classroomLessons: classroomLessonsIndex
  },
  ClassroomLesson: {
    editions: editions,
    edition: edition
  },
  Edition: {
    questions: editionQuestions
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

async function editionQuestions(parent, args, ctx) {
  const questionsData = await rethinkClient.db('quill_lessons').table('lesson_edition_questions').get(parent.id).run();
  return questionsData.questions
}