import r from 'rethinkdb';

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
        if (cursor) {
          cursor.each((err, document) => {
            if (err) throw err
            reviews[document.id] = document
            reviewCount += 1;
            if (reviewCount === numberOfReviews) {
              client.emit('classroomLessonReviews', reviews)
            }
          });
        }
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
