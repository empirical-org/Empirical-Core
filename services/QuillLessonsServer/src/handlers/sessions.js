import r from 'rethinkdb';

import { setTeacherModels } from './editions'

export function subscribeToClassroomLessonSession({
  connection,
  client,
  classroomUnitId
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
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
  .insert(previewSessionData)
  .run(connection)
}

export function updateClassroomLessonSession({ connection, session }) {
  r.table('classroom_lesson_sessions')
  .insert(session, { conflict: 'update' })
  .run(connection);
}

export function createOrUpdateClassroomLessonSession({
  connection,
  classroomUnitId,
  teacherIdObject
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .run(connection)
  .then((session) => {
    teacherIdObject ? session.teacher_ids = teacherIdObject.teacher_ids : undefined;
    session.current_slide = session && session.current_slide ? session.current_slide : 0;
    session.startTime = session && session.startTime ? session.startTime : new Date();
    session.id = session && session.id ? session.id : classroomUnitId;

    r.table('classroom_lesson_sessions')
    .insert(session, { conflict: 'replace' })
    .run(connection)
  });
};

export function setSlideStartTime({
  classroomUnitId,
  questionId,
  connection,
}) {
  let session = { id: classroomUnitId, timestamps: {} };

  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)('submissions')(questionId.toString())
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
  classroomUnitId,
  studentName,
}) {
  const nameRef = studentName.replace(/\s/g, '').toLowerCase()

  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
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
    client.emit(`studentAdded:${classroomUnitId}`, studentName, nameRef)
  });
}

export function saveStudentSubmission({
  classroomUnitId,
  connection,
  questionId,
  studentId,
  submission,
}) {
  let session = {
    id: classroomUnitId,
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
  classroomUnitId,
  connection,
  questionId,
  studentId,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId).replace(r.row.without({
    submissions: { [questionId]: { [studentId]: true } }
  }))
  .run(connection)
}

export function removeMode({
  connection,
  classroomUnitId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .replace(r.row.without({
    modes: { [questionId]: true }
  }))
  .run(connection)
}

export function clearAllSelectedSubmissions({
  connection,
  classroomUnitId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId).replace(r.row.without({
    selected_submissions: { [questionId]: true }
  }))
  .run(connection)

  removeSelectedSubmissionOrder({
    connection,
    classroomUnitId,
    questionId,
  })
}

export function clearAllSubmissions({
  connection,
  classroomUnitId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId).replace(r.row.without({
    submissions: { [questionId]: true }
  }))
  .run(connection)
}

export function saveSelectedStudentSubmission({
  classroomUnitId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
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
  classroomUnitId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .hasFields({
    selected_submission_order: {
      [questionId]: true
    }
  })
  .run(connection)
  .then((result) => {
    if (result) {
      r.table('classroom_lesson_sessions')
      .get(classroomUnitId)('selected_submission_order')(questionId)
      .contains(studentId)
      .run(connection)
      .then((result) => {
        if (!result) {
          r.table('classroom_lesson_sessions')
          .get(classroomUnitId)
          .update({
            selected_submission_order: {
              [questionId]: r.row('selected_submission_order')(questionId)
                .append(studentId)
            }
          })
          .run(connection)
        } else {
          r.table('classroom_lesson_sessions')
          .get(classroomUnitId)
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
      .get(classroomUnitId)
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
  classroomUnitId,
  questionId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .replace(r.row.without({
    selected_submission_order: {
      [questionId]: true
    }
  }))
  .run(connection)
}

export function removeSelectedStudentSubmission({
  classroomUnitId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
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
    .get(classroomUnitId)
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
  classroomUnitId,
  questionId,
  mode,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({
    modes: {
      [questionId]: mode
    }
  })
  .run(connection)
}

export function setModel({
  classroomUnitId,
  questionId,
  model,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({
    models: {
      [questionId]: model
    }
  })
  .run(connection)
}

export function setPrompt({
  classroomUnitId,
  questionId,
  prompt,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({
    prompts: {
      [questionId]: prompt
    }
  })
  .run(connection)
}

export function toggleStudentFlag({
  classroomUnitId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .hasFields({
    flaggedStudents: {
      [studentId]: true
    }
  })
  .run(connection)
  .then((result) => {
    if (result) {
      r.table('classroom_lesson_sessions')
      .get(classroomUnitId)
      .replace(r.row.without({
        flaggedStudents: {
          [studentId]: true
        }
      }))
      .run(connection)
    } else {
      r.table('classroom_lesson_sessions')
      .get(classroomUnitId)
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
  classroomUnitId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({
    watchTeacherState: true
  })
  .run(connection)
}

export function removeWatchTeacherState({
  classroomUnitId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .replace(r.row.without('watchTeacherState'))
  .run(connection)
}

export function addStudents({
  classroomUnitId,
  activitySessions,
  studentIds,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({ students: activitySessions, student_ids: studentIds })
  .run(connection)
}

export function redirectAssignedStudents({
  classroomUnitId,
  followUpOption,
  followUpUrl,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({ followUpOption, followUpUrl })
  .run(connection)
}

export function setClassroomName({
  classroomUnitId,
  classroomName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({ classroom_name: classroomName })
  .run(connection)
}

export function setTeacherName({
  classroomUnitId,
  teacherName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({ teacher_name: teacherName })
  .run(connection)
}

export function addFollowUpName({
  classroomUnitId,
  followUpActivityName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({ followUpActivityName })
  .run(connection)
}

export function addSupportingInfo({
  classroomUnitId,
  supportingInfo,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomUnitId)
  .update({ supportingInfo })
  .run(connection)
}

export function setEditionId({
  classroomUnitId,
  editionId,
  connection,
  client,
}) {
  r.table('classroom_lesson_sessions')
  .filter(r.row("id").eq(classroomUnitId))
  .run(connection)
  .then(cursor => cursor.toArray())
  .then(sessionArray => {
    const currentEditionId = sessionArray.length === 1 ? sessionArray[0].edition_id : null
    if (currentEditionId !== editionId) {
      setTeacherModels({
        classroomUnitId,
        editionId,
        connection,
      })
      r.table('classroom_lesson_sessions')
      .insert({ id: classroomUnitId, edition_id: editionId }, {conflict: 'update'})
      .run(connection)
    }
  })

  client.emit(`editionIdSet:${classroomUnitId}`)
}
