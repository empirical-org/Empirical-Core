import r from 'rethinkdb';

import { setTeacherModels } from './editions'

export function subscribeToClassroomLessonSession({
  connection,
  client,
  classroomSessionId
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .changes({ includeInitial: true })
    .run(connection, (err, cursor) => {
      cursor.each((err, document) => {
        if (err) throw err
        let session = document.new_val;
        if (session) {
          client.emit(`classroomLessonSession:${session.id}`, session)
        }
      });
    });
}

export function createPreviewSession({ connection, previewSessionData }) {
  r.table('classroom_lesson_sessions')
    .insert(previewSessionData, { conflict: 'update' })
    .run(connection)
}

export function updateClassroomLessonSession({ connection, session }) {
  r.table('classroom_lesson_sessions')
    .insert(session, { conflict: 'update' })
    .run(connection);
}

export function createOrUpdateClassroomLessonSession({
  connection,
  classroomSessionId,
  teacherIdObject
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .run(connection)
    .then((foundSession) => {
      const session = _setSessionDefaults(foundSession, classroomSessionId, teacherIdObject);

      r.table('classroom_lesson_sessions')
        .insert(session, { conflict: 'update' })
        .run(connection)
    });
};

// private function, exported for tests
export function _setSessionDefaults(oldSession, sessionId, teacherObject) {
  let session = oldSession || {};

  if (teacherObject &&  teacherObject.teacher_ids) {
    session.teacher_ids = teacherObject.teacher_ids;
  }

  session.current_slide = session.current_slide || 0;
  session.startTime = session.startTime || new Date();
  session.id = session.id || sessionId;

  return session;
}

export function setSlideStartTime({
  classroomSessionId,
  questionId,
  connection,
}) {
  let session = { id: classroomSessionId, timestamps: {} };

  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)('submissions')(questionId.toString())
    .changes({ includeInitial: true })
    .run(connection)
    .catch(() => {
      session['timestamps'][questionId.toString()] = new Date();
      updateClassroomLessonSession({
        session,
        connection,
      });
    });
}

export function addStudent({
  connection,
  client,
  classroomSessionId,
  studentName,
}) {
  const nameRef = studentName.replace(/\s/g, '').toLowerCase()

  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update((classroomActivity) => {
      let students = {};

      if (!classroomActivity.students) {
        students = { students: {} };
      } else {
        students = { students: classroomActivity['students'] };
      }
      students['students'][nameRef] = studentName;
      return students;
    })
    .run(connection)
    .then(() => {
      client.emit(`studentAdded:${classroomSessionId}`, studentName, nameRef)
    });
}

export function saveStudentSubmission({
  classroomSessionId,
  connection,
  questionId,
  studentId,
  submission,
}) {
  let session = {
    id: classroomSessionId,
    submissions: {}
  };
  const submissionWithTimestamp = {...submission, timestamp: new Date()}
  session['submissions'][questionId] = {};
  session['submissions'][questionId][studentId] = submissionWithTimestamp;

  updateClassroomLessonSession({
    session,
    connection,
  });
}

export function removeStudentSubmission({
  classroomSessionId,
  connection,
  questionId,
  studentId,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId).replace(r.row.without({
      submissions: { [questionId]: { [studentId]: true } }
    }))
    .run(connection)
}

export function removeMode({
  connection,
  classroomSessionId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .replace(r.row.without({
      modes: { [questionId]: true }
    }))
    .run(connection)
}

export function clearAllSelectedSubmissions({
  connection,
  classroomSessionId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId).replace(r.row.without({
      selected_submissions: { [questionId]: true }
    }))
    .run(connection)

  removeSelectedSubmissionOrder({
    connection,
    classroomSessionId,
    questionId,
  })
}

export function clearAllSubmissions({
  connection,
  classroomSessionId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId).replace(r.row.without({
      submissions: { [questionId]: true }
    }))
    .run(connection)
}

export function saveSelectedStudentSubmission({
  classroomSessionId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({
      selected_submissions: {
        [questionId]: {
          [studentId]: true
        }
      }
    })
    .run(connection)
}

export function updateStudentSubmissionOrder({
  classroomSessionId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .hasFields({
      selected_submission_order: {
        [questionId]: true
      }
    })
    .run(connection)
    .then((result) => {
      if (result) {
        r.table('classroom_lesson_sessions')
          .get(classroomSessionId)('selected_submission_order')(questionId)
          .contains(studentId)
          .run(connection)
          .then((result) => {
            if (!result) {
              r.table('classroom_lesson_sessions')
                .get(classroomSessionId)
                .update({
                  selected_submission_order: {
                    [questionId]: r.row('selected_submission_order')(questionId)
                      .append(studentId)
                  }
                })
                .run(connection)
            } else {
              r.table('classroom_lesson_sessions')
                .get(classroomSessionId)
                .update({
                  selected_submission_order: {
                    [questionId]: r.row('selected_submission_order')(questionId)
                      .filter((item) => item.ne(studentId))
                  }
                })
                .run(connection)
            }
          })
      } else {
        r.table('classroom_lesson_sessions')
          .get(classroomSessionId)
          .update({
            selected_submission_order: {
              [questionId]: [
                studentId
              ]
            }
          })
          .run(connection)
      }
    })
}

export function removeSelectedSubmissionOrder({
  classroomSessionId,
  questionId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .replace(r.row.without({
      selected_submission_order: {
        [questionId]: true
      }
    }))
    .run(connection)
}

export function removeSelectedStudentSubmission({
  classroomSessionId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .replace(r.row.without({
      selected_submissions: {
        [questionId]: {
          [studentId]: true
        }
      }
    }))
    .run(connection)
    .then(() => {
      r.table('classroom_lesson_sessions')
        .get(classroomSessionId)
        .replace(r.row.without({
          selected_submission_order: {
            [questionId]: [
              studentId
            ]
          }
        }))
        .run(connection)
    })
}

export function setMode({
  classroomSessionId,
  questionId,
  mode,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({
      modes: {
        [questionId]: mode
      }
    })
    .run(connection)
}

export function setModel({
  classroomSessionId,
  questionId,
  model,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({
      models: {
        [questionId]: model
      }
    })
    .run(connection)
}

export function setPrompt({
  classroomSessionId,
  questionId,
  prompt,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({
      prompts: {
        [questionId]: prompt
      }
    })
    .run(connection)
}

export function toggleStudentFlag({
  classroomSessionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .hasFields({
      flaggedStudents: {
        [studentId]: true
      }
    })
    .run(connection)
    .then((result) => {
      if (result) {
        r.table('classroom_lesson_sessions')
          .get(classroomSessionId)
          .replace(r.row.without({
            flaggedStudents: {
              [studentId]: true
            }
          }))
          .run(connection)
      } else {
        r.table('classroom_lesson_sessions')
          .get(classroomSessionId)
          .update({
            flaggedStudents: {
              [studentId]: true
            }
          })
          .run(connection)
      }
    })
}

export function setWatchTeacherState({
  classroomSessionId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({
      watchTeacherState: true
    })
    .run(connection)
}

export function removeWatchTeacherState({
  classroomSessionId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .replace(r.row.without('watchTeacherState'))
    .run(connection)
}

export function addStudents({
  classroomSessionId,
  activitySessions,
  studentIds,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({ students: activitySessions, student_ids: studentIds })
    .run(connection)
}

export function redirectAssignedStudents({
  classroomSessionId,
  followUpOption,
  followUpUrl,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({ followUpOption, followUpUrl })
    .run(connection)
}

export function setClassroomName({
  classroomSessionId,
  classroomName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({ classroom_name: classroomName })
    .run(connection)
}

export function setTeacherName({
  classroomSessionId,
  teacherName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({ teacher_name: teacherName })
    .run(connection)
}

export function addFollowUpName({
  classroomSessionId,
  followUpActivityName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({ followUpActivityName })
    .run(connection)
}

export function addSupportingInfo({
  classroomSessionId,
  supportingInfo,
  connection,
}) {
  r.table('classroom_lesson_sessions')
    .get(classroomSessionId)
    .update({ supportingInfo })
    .run(connection)
}

export function setEditionId({
  classroomSessionId,
  editionId,
  connection,
  client,
}) {
  r.table('classroom_lesson_sessions')
    .filter(r.row("id").eq(classroomSessionId))
    .run(connection)
    .then(cursor => cursor.toArray())
    .then(sessionArray => {
      const currentEditionId = sessionArray.length === 1 ? sessionArray[0].edition_id : null
      if (currentEditionId !== editionId) {
        setTeacherModels({
          classroomSessionId,
          editionId,
          connection,
        })
        r.table('classroom_lesson_sessions')
          .insert({ id: classroomSessionId, edition_id: editionId }, {conflict: 'update'})
          .run(connection)
          .then(() => {
            client.emit(`editionIdSet:${classroomSessionId}`);
          })
      } else {
        client.emit(`editionIdSet:${classroomSessionId}`);
      }
    })
}
