import r from 'rethinkdb';

export function subscribeToClassroomLesson({
  connection,
  client,
  classroomLessonUid
}) {
  r.table('classroom_lessons')
    .get(classroomLessonUid)
    .changes({ includeInitial: true })
    .run(connection, (err, cursor) => {
      cursor.each((err, document) => {
        let lesson = document.new_val;
        if (lesson) {
          client.emit(`classroomLesson:${lesson.id}`, lesson)
        }
      });
    });
}

export function getAllClassroomLessons({
  connection,
  client,
}) {
  r.table('classroom_lessons')
    .run(connection, (err, cursor) => {
      r.table('classroom_lessons').count().run(connection, (err, val) => {
        const numberOfLessons = val
        let classroomLessons = {}
        let lessonCount = 0
        if (cursor) {
          cursor.each((err, document) => {
            if (err) throw err
            classroomLessons[document.id] = document
            lessonCount += 1;
            if (lessonCount === numberOfLessons) {
              client.emit('classroomLessons', classroomLessons)
            }
          });
        }
      })
    });
}

export function createOrUpdateClassroomLesson({
  connection,
  classroomLesson,
  client
}) {
  r.table('classroom_lessons')
    .insert(classroomLesson, { conflict: 'update' })
    .run(connection)
    .then(() => {
      getAllClassroomLessons({connection, client})
    })
}

export function deleteClassroomLesson({
  connection,
  activityId
}) {
  r.table('classroom_lessons')
    .filter({id: activityId})
    .delete()
    .run(connection)
}
