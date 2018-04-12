const r = require('rethinkdb');
const io = require('socket.io')();
const fetch = require('node-fetch');

function subscribeToClassroomLessonSession({
  connection,
  client,
  classroomLessonSessionId
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomLessonSessionId)
  .run(connection)
  .then((classroomLessonSession) => {
    client.emit(`classroomLessonSession:${classroomLessonSessionId}`,classroomLessonSession);
  });
}

function createPreviewSession({ connection, previewSessionData }) {
  r.table('classroom_lesson_sessions')
  .insert(previewSessionData)
  .run(connection)
}

function subscribeToCurrentSlide({
  connection,
  client,
  classroomActivityId
}) {
  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .getField('current_slide')
  .run(connection)
  .then((currentSlide) => {
    client.emit(`currentSlide:${classroomActivityId}`, currentSlide)
  });
}

function updateClassroomLessonSession({ connection, session }) {
  r.table('classroom_lesson_sessions')
  .insert(session, { conflict: 'update' })
  .run(connection);
}

function createOrUpdateClassroomLessonSession({
  connection,
  classroomActivityId
}) {
  const url = process.env.EMPIRICAL_BASE_URL +
    '/api/v1/classroom_activities/' +
    classroomActivityId +
    '/classroom_teacher_and_coteacher_ids'

  r.table('classroom_lesson_sessions')
  .get(classroomActivityId)
  .run(connection)
  .then((session) => {
    fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        console.log(response.statusText)
      } else {
        return response.json()
      }
    }).then(response => {
      response ? session.teacher_ids = response.teacher_ids : undefined;
      session.current_slide = session && session.current_slide ? session.current_slide : 0;
      session.startTime = session && session.startTime ? session.startTime : new Date();
      session.id = session && session.id ? session.id : classroomActivityId;

      r.table('classroom_lesson_sessions')
      .insert(session, { conflict: 'replace' })
      .run(connection)
    });
  });
}

r.connect({
  host: 'localhost',
  port: 28015,
  db: 'quill_lessons'
}).then((connection) => {
  io.on('connection', (client) => {
    client.on('teacherConnect', (classroomActivityId) => {

    });

    client.on('disconnect', )

    client.on('subscribeToClassroomLessonSession', (classroomLessonSessionId) => {
      subscribeToClassroomLessonSession({
        connection,
        client,
        classroomLessonSessionId,
      });
    });

    client.on('createPreviewSession', (previewSessionData) => {
      createPreviewSession({
        connection,
        previewSessionData
      });
    });

    client.on('subscribeToCurrentSlide', (classroomActivityId) => {
      subscribeToCurrentSlide({
        connection,
        client,
        classroomActivityId
      });
    });

    client.on('updateClassroomLessonSession', (session) => {
      updateClassroomLessonSession({
        session,
        connection
      });
    });

    client.on('createOrUpdateClassroomLessonSession', (classroomActivityId) => {
      createOrUpdateClassroomLessonSession({
        connection,
        classroomActivityId
      });
    });
  });
});

io.listen(8000);
console.log('listening on port ', 8000);
