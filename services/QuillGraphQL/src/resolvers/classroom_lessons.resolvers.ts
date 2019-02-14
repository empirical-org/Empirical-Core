import rethinkClient from '../utils/rethinkdb';
import { teacherHasPermission, userHasPermission, studentHasPermission } from '../utils/permissions';
import {ForbiddenError} from 'apollo-server-errors';
import * as uuid from 'uuid/v4';
import { keyArrayToRemovalHash, keysArrayAndValueToNestedValue } from '../utils/rethinkdb_helpers';
import * as R from "ramda";

type RethinkChangeObject = {
  errors?: number
  inserted?: number
  first_error?: string
  deleted?: number
  replaced?: number
  unchanged?: number
  skipped?: number
}

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
    questions: editionQuestions,
    lesson: editionLesson
  },
  ClassroomLessonSession: {
    edition: sessionEdition
  },
  Mutation: {
    setSessionCurrentSlide,
    setEditionId,
    flagStudent,
    createPreviewSession,
    deleteStudentSubmissionForSlide,
    deleteAllSubmissionsForSlide,
    selectStudentSubmission,
    deselectStudentSubmission,
    deselectAllStudentSubmissions,
  },
  Subscription: {
    classroomLessonSession: {
      subscribe: async (parent, {id, studentId}, ctx) => {
        const sess = await getClassroomLessonSession(id);
        const channel = id;
        if (!userHasPermission(sess, ctx.user)) return new ForbiddenError("You don't have access to this session.")
        if (teacherHasPermission(sess, ctx.user)) {
          getSessionRethinkRoot(id)
          .changes({ includeInitial: true })
          .run((err, cursor) => {
            cursor.each((err, document) => {
              if (err) throw err
              let session = document.new_val;
              if (session) {
                ctx.pubSub.publish(channel, {classroomLessonSession: session})
              }
            })
            setAbsentTeacherState(id, false);
            ctx.socket.onDisconnect = () => {
              setAbsentTeacherState(id, true);
              cursor.close()
            }
          })
        }
        else if (studentId && studentHasPermission(sess, ctx.user)) {
          setTimeout(() => {
            setStudentPresence(id, studentId, true);
          }, 1000)
          
          ctx.socket.onDisconnect = () => {
            removeValueFromSession(id, {'presence': {[studentId]: true}})
          }
        }
        return ctx.pubSub.asyncIterator(channel)
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

function sessionEdition({edition_id}, args, ctx) {
  return rethinkClient.db('quill_lessons').table('lesson_edition_metadata').get(edition_id).run()
}

function edition(parent, {id}, ctx) {
  return rethinkClient.db('quill_lessons').table('lesson_edition_metadata').get(id).run()
}

async function editionQuestions(parent, args, ctx) {
  const questionsData = await rethinkClient.db('quill_lessons').table('lesson_edition_questions').get(parent.id).run();
  return questionsData.questions
}

function editionLesson({lesson_id}, args, ctx) {
  return rethinkClient.db('quill_lessons').table('classroom_lessons').get(lesson_id).run()
}

async function classroomLessonSession(parent, {id}, ctx) {
  const sessionData = await getClassroomLessonSession(id)
  if (userHasPermission(sessionData, ctx.user)) {
    return sessionData
  } else {
    return new ForbiddenError("You don't have access to this session.")
  }
  
}

async function setSessionCurrentSlide(parent, {id, slideNumber}, ctx):Promise<boolean|Error> {
  if (await authHelper(id, 'teacher', ctx)) {
    
    rethinkClient.db('quill_lessons').table('classroom_lesson_sessions').get(id).update({current_slide: slideNumber}).run();
    
    return true;
  } else {
    return new ForbiddenError("You are not the teacher of this session")
  }
}

async function getClassroomLessonSession(id: string) {
  return await getSessionRethinkRoot(id).run();
}

function getSessionRethinkRoot(id: string) {
  return rethinkClient.db('quill_lessons').table('classroom_lesson_sessions').get(id)
}

function setAbsentTeacherState(id: string, value: boolean) {
  getSessionRethinkRoot(id)
    .update({absentTeacherState: value})
    .run()
}

function setStudentPresence(id: string, studentId: string, value: boolean) {
  getSessionRethinkRoot(id).update({'presence': {
    [studentId]: value
  }}).run() 
}

function createPreviewSession(_, {lessonId, editionId}) {
  const previewSession = `prvw-${uuid()}`
  const sessionId = `${previewSession}${lessonId}`;
  return rethinkClient.db('quill_lessons').table('classroom_lesson_sessions')
  .insert({
    'id': sessionId,
    'students': { 'student': 'James Joyce' },
    'current_slide': '0',
    'public': true,
    'preview': true,
    'edition_id': editionId,
  })
  .run()
  .then( () => previewSession )
}

async function setEditionId(_, {id, editionId}, ctx):Promise<RethinkChangeObject|Error> {
  if (await authHelper(id, 'teacher', ctx)) {
    return updateValuesForSession(id, {'edition_id': editionId})
  } else {
    return new ForbiddenError("You are not the teacher of this session")
  }
}

async function flagStudent(_, {id, studentId}, ctx):Promise<RethinkChangeObject|Error> {
  if (await authHelper(id, 'teacher', ctx)) {
    return updateValuesForSession(id, {'flaggedStudents': {[studentId]: true}})
  } else {
    return new ForbiddenError("You are not the teacher of this session")
  }
}

async function deleteStudentSubmissionForSlide(_, {id, studentId, slideNumber}, ctx):Promise<RethinkChangeObject|Error> {
  if (await authHelper(id, 'teacher', ctx)) {
    const payload =  Object.assign(
      keyArrayToRemovalHash(["submissions", slideNumber, studentId]), 
      keyArrayToRemovalHash(["selected_submissions", slideNumber, studentId])
    );
    removeValueFromSession(id, payload);
    return getSessionRethinkRoot(id)("selected_submission_order")(slideNumber).difference([studentId]).run()
  } else {
    return new ForbiddenError("You are not the teacher of this session")
  }
}

async function deleteAllSubmissionsForSlide(_, {id, slideNumber}, ctx):Promise<RethinkChangeObject|Error> {
  if (await authHelper(id, 'teacher', ctx)) {
    const payload = Object.assign(
      keyArrayToRemovalHash(["submissions", slideNumber]),
      keyArrayToRemovalHash(["selected_submissions", slideNumber]),
      keyArrayToRemovalHash(["selected_submission_order", slideNumber])
    )
    return removeValueFromSession(id, payload)
  } else {
    return new ForbiddenError("You are not the teacher of this session")
  }
}

async function selectStudentSubmission(_, {id, studentId, slideNumber}, ctx):Promise<RethinkChangeObject|Error> {
  if (await authHelper(id, 'teacher', ctx)) {
    const payload =  Object.assign(
      keyArrayToRemovalHash(["selected_submissions", slideNumber, studentId])
    );
    updateValuesForSession(id, payload);
    return await rethinkPathAppenderHelper(getSessionRethinkRoot(id), ["selected_submission_order",slideNumber], studentId)
  } else {
    return new ForbiddenError("You are not the teacher of this session")
  }
}

async function deselectStudentSubmission(_, {id, studentId, slideNumber}, ctx):Promise<RethinkChangeObject|Error> {
  if (await authHelper(id, 'teacher', ctx)) {
    const payload =  Object.assign(
      keyArrayToRemovalHash(["selected_submissions", slideNumber, studentId]),
      keysArrayAndValueToNestedValue(["selected_submission_order", slideNumber], rethinkClient.row("selected_submission_order")(slideNumber).without([studentId]))
    );
    removeValueFromSession(id, keyArrayToRemovalHash(["selected_submissions", slideNumber, studentId]));
    return updateValuesForSession(id, keysArrayAndValueToNestedValue(["selected_submission_order", slideNumber], rethinkClient.row("selected_submission_order")(slideNumber).difference([studentId])))
  } else {
    return new ForbiddenError("You are not the teacher of this session")
  }
}

async function deselectAllStudentSubmissions(_, {id, studentId, slideNumber}, ctx):Promise<RethinkChangeObject|Error> {
  if (await authHelper(id, 'teacher', ctx)) {
    const payload =  Object.assign( 
      keyArrayToRemovalHash(["selected_submissions", slideNumber, studentId]),
      keyArrayToRemovalHash(["selected_submission_order", slideNumber])
    );
    return removeValueFromSession(id, payload);
  } else {
    return new ForbiddenError("You are not the teacher of this session")
  }
}

function updateValuesForSession(id: string, values: any):RethinkChangeObject {
  return getSessionRethinkRoot(id).update(values).run()
}

async function removeValueFromSession(id: string, valueToRemove: any):Promise<RethinkChangeObject> {
  return getSessionRethinkRoot(id)
    .replace(rethinkClient.row.without(valueToRemove))
    .run()
    .then(result => {
      return result
    })
}

async function authHelper(sessionId: string, role: string, ctx: any):Promise<boolean> {
  const session = await getSessionRethinkRoot(sessionId).run()
  switch(role) {
    case 'user':
      return userHasPermission(session, ctx.user)
    case 'teacher':
      return userHasPermission(session, ctx.user)
    case 'student':
      return userHasPermission(session, ctx.user)
    default:
      
  }
  return true
}

async function rethinkPathAppenderHelper(documentRoot, path: string[], valueToAppend:any):Promise<RethinkChangeObject|Error>{
  const appendFn = R.reduce((a, b) => a(b), rethinkClient.row, path).default([]).append(valueToAppend)
  return documentRoot.update(keysArrayAndValueToNestedValue(path, appendFn))
}

async function rethinkPathExists(documentRoot, path: string[]):Promise<any>{
  const pathToTraverse = R.dropLast(1, path);
  const objectToCheck = R.takeLast(1, path);
  const fullPath = R.reduce((a, b) => a(b), documentRoot, pathToTraverse)
  return fullPath.hasFields(objectToCheck).run()
} 