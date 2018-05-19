import r from 'rethinkdb';

import { setTeacherModels } from './editions'

export function subscribeToClassroomLessonSession({
  connection,
  client,
  classroomActivityId
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
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
  classroomActivityId,
  teacherIdObject
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .run(connection)
  .then((session) => {
    teacherIdObject ? session.teacher_ids = teacherIdObject.teacher_ids : undefined;
    session.current_slide = session && session.current_slide ? session.current_slide : 0;
    session.startTime = session && session.startTime ? session.startTime : new Date();
    session.id = session && session.id ? session.id : classroomActivityId;

    r.table('classroom_lesson_sessions')
    .insert(session, { conflict: 'replace' })
    .run(connection)
  });
};

export function setSlideStartTime({
  classroomActivityId,
  questionId,
  connection,
}) {
  let session = { id: classroomActivityId, timestamps: {} };

  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)('submissions')(questionId.toString())
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
  classroomActivityId,
  studentName,
}) {
  const nameRef = studentName.replace(/\s/g, '').toLowerCase()

  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
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
    client.emit(`studentAdded:${classroomActivityId}`, studentName, nameRef)
  });
}

export function saveStudentSubmission({
  classroomActivityId,
  connection,
  questionId,
  studentId,
  submission,
}) {
  let session = {
    id: classroomActivityId,
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
  classroomActivityId,
  connection,
  questionId,
  studentId,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId).replace(r.row.without({
    submissions: { [questionId]: { [studentId]: true } }
  }))
  .run(connection)
}

export function removeMode({
  connection,
  classroomActivityId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .replace(r.row.without({
    modes: { [questionId]: true }
  }))
  .run(connection)
}

export function clearAllSelectedSubmissions({
  connection,
  classroomActivityId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId).replace(r.row.without({
    selected_submissions: { [questionId]: true }
  }))
  .run(connection)

  removeSelectedSubmissionOrder({
    connection,
    classroomActivityId,
    questionId,
  })
}

export function clearAllSubmissions({
  connection,
  classroomActivityId,
  questionId,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId).replace(r.row.without({
    submissions: { [questionId]: true }
  }))
  .run(connection)
}

export function saveSelectedStudentSubmission({
  classroomActivityId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
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
  classroomActivityId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .hasFields({
    selected_submission_order: {
      [questionId]: true
    }
  })
  .run(connection)
  .then((result) => {
    if (result) {
      r.table('classroom_lesson_sessions')
      .get(classroomActivityId)('selected_submission_order')(questionId)
      .contains(studentId)
      .run(connection)
      .then((result) => {
        if (!result) {
          r.table('classroom_lesson_sessions')
          .get(classroomActivityId)
          .update({
            selected_submission_order: {
              [questionId]: r.row('selected_submission_order')(questionId)
                .append(studentId)
            }
          })
          .run(connection)
        } else {
          r.table('classroom_lesson_sessions')
          .get(classroomActivityId)
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
      .get(classroomActivityId)
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
  classroomActivityId,
  questionId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .replace(r.row.without({
    selected_submission_order: {
      [questionId]: true
    }
  }))
  .run(connection)
}

export function removeSelectedStudentSubmission({
  classroomActivityId,
  questionId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
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
    .get(classroomActivityId)
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
  classroomActivityId,
  questionId,
  mode,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({
    modes: {
      [questionId]: mode
    }
  })
  .run(connection)
}

export function setModel({
  classroomActivityId,
  questionId,
  model,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({
    models: {
      [questionId]: model
    }
  })
  .run(connection)
}

export function setPrompt({
  classroomActivityId,
  questionId,
  prompt,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({
    prompts: {
      [questionId]: prompt
    }
  })
  .run(connection)
}

export function toggleStudentFlag({
  classroomActivityId,
  studentId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .hasFields({
    flaggedStudents: {
      [studentId]: true
    }
  })
  .run(connection)
  .then((result) => {
    if (result) {
      r.table('classroom_lesson_sessions')
      .get(classroomActivityId)
      .replace(r.row.without({
        flaggedStudents: {
          [studentId]: true
        }
      }))
      .run(connection)
    } else {
      r.table('classroom_lesson_sessions')
      .get(classroomActivityId)
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
  classroomActivityId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({
    watchTeacherState: true
  })
  .run(connection)
}

export function removeWatchTeacherState({
  classroomActivityId,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .replace(r.row.without('watchTeacherState'))
  .run(connection)
}

export function addStudents({
  classroomActivityId,
  activitySessions,
  studentIds,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({ students: activitySessions, student_ids: studentIds })
  .run(connection)
}

export function redirectAssignedStudents({
  classroomActivityId,
  followUpOption,
  followUpUrl,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({ followUpOption, followUpUrl })
  .run(connection)
}

export function setClassroomName({
  classroomActivityId,
  classroomName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({ classroom_name: classroomName })
  .run(connection)
}

export function setTeacherName({
  classroomActivityId,
  teacherName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({ teacher_name: teacherName })
  .run(connection)
}

export function addFollowUpName({
  classroomActivityId,
  followUpActivityName,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({ followUpActivityName })
  .run(connection)
}

export function addSupportingInfo({
  classroomActivityId,
  supportingInfo,
  connection,
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .update({ supportingInfo })
  .run(connection)
}

export function setEditionId({
  classroomActivityId,
  editionId,
  connection,
  client,
}) {
  r.table('classroom_lesson_sessions')
  .filter(r.row("id").eq(classroomActivityId))
  .run(connection)
  .then(cursor => cursor.toArray())
  .then(sessionArray => {
    const currentEditionId = sessionArray.length === 1 ? sessionArray[0].edition_id : null
    if (currentEditionId !== editionId) {
      setTeacherModels({
        classroomActivityId,
        editionId,
        connection,
      })
      r.table('classroom_lesson_sessions')
      .insert({ id: classroomActivityId, edition_id: editionId }, {conflict: 'update'})
      .run(connection)
    }
  })

  client.emit(`editionIdSet:${classroomActivityId}`)
}
