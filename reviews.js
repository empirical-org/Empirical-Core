import r from 'rethinkdb';

export function saveReview({
  classroomActivityId,
  activityId,
  value,
  connection,
}) {
  r.table('reviews')
  .set({
    id: classroomActivityId,
    activity_id: activityId,
    classroom_activity_id: classroomActivityId,
    timestamp: new Date(),
    value: value,
  })
}

export function getAllClassroomLessonReviews({
  connection,
  client
}) {
  r.table('reviews')
  .run(connection, (err, cursor) => {
    r.table('reviews').count().run(connection, (err, val) => {
      const numberOfReviews = val
      let reviews = {}
      let reviewCount = 0
      cursor.each((err, document) => {
        if (err) throw err
        reviews[document.id] = document
        reviewCount++
        if (reviewCount === numberOfReviews) {
          client.emit('classroomLessonReviews', reviews)
        }
      });
    })
  });
}

export function createOrUpdateReview({
  connection,
  review
}) {
  review.timestamp = new Date()
  r.table('reviews')
  .insert(review, { conflict: 'update' })
  .run(connection)
}
