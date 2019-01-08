import rethinkClient from '../utils/rethinkdb';

export default {
  Query: {
    classroomLesson: classroomLesson,
    classroomLessons: classroomLessonsIndex,
    classroomLessonSession: classroomLessonSession
  },
  ClassroomLesson: {
    editions: editions,
    edition: edition
  },
  Edition: {
    questions: editionQuestions
  },
  Mutation: {
    setSessionCurrentSlide
  },
  Subscription: {
    classroomLessonSession: {
      subscribe: (parent, {id}, ctx) => {
        const channel = id;
        rethinkClient
          .db('quill_lessons')
          .table('classroom_lesson_sessions')
          .get(id)
          .changes({ includeInitial: true })
          .run((err, cursor) => {
            cursor.each((err, document) => {
              if (err) throw err
              let session = document.new_val;
              if (session) {
                console.log("ctx: ", ctx)
                ctx.pubSub.publish(channel, {classroomLessonSession: session})
              }
            }
          ) 
        })
        return ctx.pubSub.asyncIterator(channel);
    }
  }
}
}

function classroomLessonsIndex(parent, args, ctx) {
  return rethinkClient.db('quill_lessons').table('classroom_lessons').run()
}

function classroomLesson(parent, {id}) {
  return rethinkClient.db('quill_lessons').table('classroom_lessons').get(id).run()
}

function editions(parent, args, ctx) {
  return rethinkClient.db('quill_lessons').table('lesson_edition_metadata').filter({lesson_id:  parent.id}).run()
}

function edition(parent, {id}, ctx) {
  return rethinkClient.db('quill_lessons').table('lesson_edition_metadata').get(id).run()
}

async function editionQuestions(parent, args, ctx) {
  const questionsData = await rethinkClient.db('quill_lessons').table('lesson_edition_questions').get(parent.id).run();
  return questionsData.questions
}

function classroomLessonSession(parent, {id}, ctx) {
  return rethinkClient.db('quill_lessons').table('classroom_lesson_sessions').get(id).run();
}

function setSessionCurrentSlide(parent, {id, slideNumber}, ctx) {
  return rethinkClient.db('quill_lessons').table('classroom_lesson_sessions').get(id).update({current_slide: slideNumber}).run();
}