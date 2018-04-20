declare function require(name:string);
import  C from '../constants';
import _ from 'lodash'
import * as IntF from '../components/classroomLessons/interfaces';
import * as CustomizeIntF from 'app/interfaces/customize'

import lessonBoilerplate from '../components/classroomLessons/shared/classroomLessonBoilerplate'
import lessonSlideBoilerplates from '../components/classroomLessons/shared/lessonSlideBoilerplates'
import scriptItemBoilerplates from '../components/classroomLessons/shared/scriptItemBoilerplates'

import uuid from 'uuid/v4';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');

export function getClassLesson(classroomLessonUid: string) {
  console.log('getting a lesson')
  return function (dispatch) {
    socket.on(`classroomLesson:${classroomLessonUid}`, (lesson) => {
      if (lesson) {
          dispatch(updateClassroomLesson(lesson));
          dispatch(setLessonId(classroomLessonUid))
      } else {
        dispatch({type: C.NO_LESSON_ID, data: classroomLessonUid})
      }
    });
    socket.emit('subscribeToClassroomLesson', classroomLessonUid);
  };
}

export function updateClassroomLesson(data) {
  return {
    type: C.RECEIVE_CLASSROOM_LESSON_DATA,
    data,
  }
}

export function setLessonId(id:string) {
  return {
    type: C.SET_LESSON_ID,
    id
  }
}

export function listenForClassroomLessons() {
  console.log('getting classroom lessons')
  return function (dispatch) {
    socket.on('classroomLessons', (classroomLessons) => {
      if (classroomLessons) {
        dispatch(updateClassroomLessons(classroomLessons))
      } else {
        dispatch({type: C.NO_LESSONS})
      }
    });
    socket.emit('getAllClassroomLessons');
  };
}

export function listenForClassroomLessonReviews() {
  return function (dispatch) {
    socket.on('classroomLessonReviews', (reviews) => {
      if (reviews) {
        dispatch(updateClassroomLessonsReviews(reviews))
      }
    });
    socket.emit('getAllClassroomLessonReviews');
  };
}

export function updateClassroomLessons(data) {
  return ({type: C.RECEIVE_CLASSROOM_LESSONS_DATA, data: data})
}

export function updateClassroomLessonsReviews(data) {
  const reviewsGroupedByClassroomLessonId = {}
  const classroomActivityIds = Object.keys(data)
  classroomActivityIds.forEach((ca_id) => {
    const review = data[ca_id]
    const lessonId = review.activity_id
    if (reviewsGroupedByClassroomLessonId[lessonId]) {
      reviewsGroupedByClassroomLessonId[lessonId][ca_id] = review
    } else {
      reviewsGroupedByClassroomLessonId[lessonId] = { [ca_id]: review }
    }
  })
  return ({type: C.RECEIVE_CLASSROOM_LESSONS_REVIEW_DATA, data: reviewsGroupedByClassroomLessonId})
}

export function addSlide(editionId: string, editionQuestions: CustomizeIntF.EditionQuestions, slideType: string, callback:Function|undefined) {
  const newEdition: CustomizeIntF.EditionQuestions = _.merge({}, editionQuestions)
  const newSlide: IntF.Question = lessonSlideBoilerplates[slideType]
  newEdition.questions.splice(-1, 0, newSlide)

  socket.on(`slideAdded:${editionId}`, () => {
    if (callback) {
      callback(Number(newEdition.questions.length) - 2)
    }
  })
  socket.emit('addSlide', editionId, newEdition)
}

export function deleteEditionSlide(editionId, slideId, slides) {
  const newSlides = _.compact(Object.keys(slides).map(slideKey => {
    if (slideKey != slideId ) {
      return slides[slideKey]
    }
  }))
  socket.emit('deleteEditionSlide', editionId, newSlides)
}

export function addScriptItem(editionId: string, slideId: string, slide: IntF.Question, scriptItemType: string, callback: Function|undefined) {
  const newSlide = _.merge({}, slide)
  newSlide.data.teach.script.push(scriptItemBoilerplates[scriptItemType])

  socket.on(`scriptItemDeleted:${editionId}`, () => {
    if (callback) {
      callback(newSlide.data.teach.script.length - 1)
    }
  })
  socket.emit('addScriptItem', editionId, slideId, newSlide)
}

export function deleteScriptItem(editionId, slideId, scriptItemId, script) {
  const newScript = _.compact(Object.keys(script).map(scriptKey => {
    if (scriptKey != scriptItemId ) {
      return script[scriptKey]
    }
  }))
  socket.emit('deleteScriptItem', editionId, slideId, newScript)
}

export function addLesson(lessonName, cb) {
  const newLesson:IntF.ClassroomLesson = lessonBoilerplate(lessonName)
  const newLessonKey = uuid();
  newLesson.id = newLessonKey
  if (newLessonKey) {
    socket.emit('createOrUpdateClassroomLesson', newLesson)
  }

  socket.on(`createdOrUpdatedClassroomLesson:${newLessonKey}`, (lessonUpdated) => {
    if (lessonUpdated) {
      if (cb) {
        cb(newLessonKey)
      }
    }
  })
}

export function saveEditionSlide(editionId, slideId, slideData, callback) {
  socket.on(`editionSlideSaved:${editionId}`, () => {
    if (callback) {
      callback()
    }
  })
  socket.emit('saveEditionSlide', editionId, slideId, slideData)
}

export function saveEditionScriptItem(editionId, slideId, scriptItemId, scriptItem, callback) {
  socket.on(`editionScriptItemSaved:${editionId}`, () => {
    if (callback) {
      callback();
    }
  })

  socket.emit('saveEditionScriptItem',
    editionId,
    slideId,
    scriptItemId,
    scriptItem,
  )
}

export function deleteLesson(classroomLessonID) {
  socket.emit('deleteClassroomLesson', classroomLessonID)
}

export function deleteEdition(editionID) {
  socket.emit('deleteEdition', editionID)
}

export function updateSlideScriptItems(editionID, slideID, scriptItems) {
  socket.emit('updateSlideScriptItems', editionID, slideID, scriptItems)
}

export function updateEditionSlides(editionID, slides) {
  socket.emit('updateEditionSlides', editionID, slides)
}

export function updateClassroomLessonDetails(classroomLessonID, classroomLesson) {
  classroomLesson.id = classroomLessonID
  socket.emit('createOrUpdateClassroomLesson', classroomLesson)
}

export function updateEditionDetails(editionID, edition) {
  edition.id = editionID
  socket.emit('updateEditionMetadata', edition)
}

export function clearClassroomLessonFromStore() {
  return ({type: C.CLEAR_CLASSROOM_LESSON_DATA})
}
