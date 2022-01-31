import r from 'rethinkdb';

export function setTeacherModels({
  classroomSessionId,
  editionId,
  connection,
}) {
  r.table('lesson_edition_questions')
    .filter(r.row("id").eq(editionId))
    .run(connection)
    .then(cursor => cursor.toArray())
    .then(editionsArray => {
      const questions = editionsArray.length === 1 ? editionsArray[0].questions : null
      r.table('classroom_lesson_sessions')
        .filter(r.row("id").eq(classroomSessionId))
        .run(connection)
        .then(cursor => cursor.toArray())
        .then(sessionsArray => {
          const prompts = sessionsArray.length === 1 ? sessionsArray[0].prompts : null
          if (questions && prompts) {
            Object.keys(prompts).forEach(key => {
              let canUpdate = questions[key] &&
              questions[key].data &&
              questions[key].data.play &&
              questions[key].data.play.prompt;

              if (canUpdate) {
                let shouldUpdate = prompts[key] !== questions[key].data.play.prompt;

                if (shouldUpdate) {
                  r.table('classroom_lesson_sessions')
                    .get(classroomSessionId)
                    .update({
                      prompts: {
                        [key]: questions[key].data.play.prompt
                      }
                    })
                    .run(connection)

                  r.table('classroom_lesson_sessions')
                    .get(classroomSessionId)
                    .replace(r.row.without({
                      models: {
                        [key]: true
                      }
                    }))
                    .run(connection)
                }
              }
            })
          }
        })
    })
}

export function getAllEditionMetadata({
  client,
  connection
}) {
  r.table('lesson_edition_metadata')
    .run(connection, (err, cursor) => {
      r.table('lesson_edition_metadata').count().run(connection, (err, val) => {
        const numberOfEditions = val
        let editions = {}
        let editionCount = 0
        if (cursor) {
          cursor.each((err, document) => {
            if (err) throw err
            editions[document.id] = document
            editionCount += 1;
            if (editionCount === numberOfEditions) {
              client.emit('editionMetadata', editions)
            }
          });
        }
      })

    })
}

export function getEditionMetadataForLesson({
  client,
  connection,
  activityId,
  editionId,
}) {
  if (activityId && editionId) {
    r.table('lesson_edition_metadata')
      .get(editionId)
      .filter(r.row('lesson_id').eq(activityId))
      .run(connection)
      .then((cursor) => {
        let editions = {};
        cursor.toArray((err, results) => {
          results.forEach((result) => {
            editions[result.id] = result;
          });
          client.emit(`editionMetadataForLesson:${activityId}`, editions)
        });
      })
  }
}

export function getAllEditionMetadataForLesson({
  client,
  connection,
  activityId,
  callback
}) {
  if (activityId) {
    r.table('lesson_edition_metadata')
      .filter(r.row('lesson_id').eq(activityId))
      .filter(
        r.row.hasFields('flags').not().or(
          r.row('flags').contains('archived').not()
        )
      )
      .run(connection)
      .then((cursor) => {
        let editions = {};
        cursor.toArray((err, results) => {
          results.forEach((result) => {
            editions[result.id] = result;
          });
          client.emit(`editionMetadataForLesson:${activityId}`, editions)
        });
      })
  }
}

export function getEditionQuestions({
  editionId,
  connection,
  client
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .changes({ includeInitial: true })
    .run(connection)
    .then(cursor => {
      cursor.each((err, document) => {
        let edition = document.new_val;
        if (edition) {
          client.emit(`editionQuestionsForEdition:${edition.id}`, edition)
        }
      });
    });
}

export function updateEditionMetadata({
  connection,
  editionMetadata,
  client
}) {
  r.table('lesson_edition_metadata')
    .insert(editionMetadata, { conflict: 'update', returnChanges: true })
    .run(connection)
    .then(cursor => {
      return cursor.changes
    })
    .then(results => {
      const edition  = results[0] ? results[0].new_val : null
      const activityId = edition.lesson_id

      if (edition && activityId) {
        getAllEditionMetadataForLesson({ connection, client, activityId })
      }

      if (edition) {
        getAllEditionMetadata({ connection, client })
      }
    })
}

export function deleteEdition({
  editionId,
  connection,
  client
}) {
  if (editionId) {
    r.table('lesson_edition_metadata')
      .filter({id: editionId})
      .delete()
      .run(connection)
      .then(() => {
        getAllEditionMetadata({ connection, client })
      })
  }
}

export function updateEditionSlides({
  editionId,
  slides,
  connection,
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .update({ questions: slides })
    .run(connection)
}

export function updateSlideScriptItems({
  editionId,
  slideId,
  scriptItems,
  connection,
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .run(connection)
    .then(edition => {
      const editionWithUpdatedSlide = edition
      editionWithUpdatedSlide.questions[slideId].data.teach.script = scriptItems
      r.table('lesson_edition_questions')
        .insert(editionWithUpdatedSlide, {conflict: 'update'})
        .run(connection)
    })
}

export function saveEditionSlide({
  editionId,
  slideId,
  slideData,
  connection,
  client,
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .run(connection)
    .then(edition => {
      const editionWithUpdatedSlide = edition
      editionWithUpdatedSlide.questions[slideId].data = slideData
      r.table('lesson_edition_questions')
        .insert(editionWithUpdatedSlide, {conflict: 'update'})
        .run(connection, () => {
          client.emit(`editionSlideSaved:${editionId}`)
        })
    })

}

export function saveEditionScriptItem({
  editionId,
  slideId,
  scriptItemId,
  scriptItem,
  connection,
  client,
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .run(connection)
    .then(edition => {
      const editionWithUpdatedScriptItem = edition
      editionWithUpdatedScriptItem.questions[slideId].data.teach.script[scriptItemId] = scriptItem
      r.table('lesson_edition_questions')
        .insert(editionWithUpdatedScriptItem, {conflict: 'update'})
        .run(connection, () => {
          client.emit(`editionScriptItemSaved:${editionId}`)
        })
    })
}

export function deleteScriptItem({
  editionId,
  slideId,
  script,
  connection,
  client,
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .run(connection)
    .then(edition => {
      const newEdition = edition
      edition.questions[slideId].data.teach.script = script
      r.table('lesson_edition_questions')
        .insert(newEdition, {conflict: 'update'})
        .run(connection)
    })
}

export function addScriptItem({
  editionId,
  slideId,
  slide,
  connection,
  client
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .run(connection)
    .then(edition => {
      const newEdition = edition
      edition.questions[slideId] = slide
      r.table('lesson_edition_questions')
        .insert(newEdition, {conflict: 'update'})
        .run(connection)
        .then(() => {
          client.emit(`scriptItemAdded:${editionId}`)
        })
    })
}

export function deleteEditionSlide({
  editionId,
  slides,
  connection,
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .update({
      questions: slides
    })
    .run(connection)
}

export function addSlide({
  editionId,
  newEdition,
  connection,
  client,
}) {
  r.table('lesson_edition_questions')
    .get(editionId)
    .update(newEdition)
    .run(connection, () => {
      client.emit(`slideAdded:${editionId}`)
    })
}

export function updateEditionQuestions({
  connection,
  editionQuestions
}) {
  r.table('lesson_edition_questions')
    .insert(editionQuestions, { conflict: 'update' })
    .run(connection)
}

export function createNewEdition({
  connection,
  editionData,
  client,
  questions
}) {
  updateEditionMetadata({
    connection: connection,
    editionMetadata: editionData,
    client: client
  })
  if (editionData.edition_id) {
    r.table('lesson_edition_questions')
      .get(editionData.edition_id)
      .run(connection)
      .then(editionQuestions => {
        editionQuestions.id = editionData.id
        r.table('lesson_edition_questions')
          .insert(editionQuestions, { conflict: 'update' })
          .run(connection)
      })
  } else if (questions) {
    const editionQuestions = {id: editionData.id, questions}
    r.table('lesson_edition_questions')
      .insert(editionQuestions, { conflict: 'update' })
      .run(connection)
  } else {
    r.table('classroom_lessons')
      .get(editionData.lesson_id)
      .getField('questions')
      .run(connection)
      .then(lessonQuestions => {
        const editionQuestions = {id: editionData.id, questions: lessonQuestions}
        r.table('lesson_edition_questions')
          .insert(editionQuestions, { conflict: 'update'} )
          .run(connection)
      })
  }
  getAllEditionMetadata({client, connection})
  client.emit(`editionCreated:${editionData.id}`)
}

export function publishEdition({
  client,
  connection,
  editionMetadata,
  editionQuestions
}) {
  editionMetadata.last_published_at = new Date()
  updateEditionMetadata({editionMetadata, connection, client})
  updateEditionQuestions({editionQuestions, connection})
}

export function archiveEdition({
  connection,
  editionId,
  client
}) {
  let editionMetadata
  r.table('lesson_edition_metadata')
    .get(editionId)
    .pluck('flags')
    .run(connection)
    .then(flags => {
      if (flags && flags.length > 0) {
        editionMetadata = {id: editionId, flags: flags.push('archived')}
      } else {
        editionMetadata = {id: editionId, flags: ['archived']}
      }
      updateEditionMetadata({connection, editionMetadata, client})
    })
}
