declare function require(name:string);
import  C from '../constants';
import rootRef, { firebase } from '../libs/firebase';
const reviewsRef = rootRef.child('reviews');
const editionMetadataRef = rootRef.child('lesson_edition_metadata');
const editionQuestionsRef = rootRef.child('lesson_edition_questions');
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

export function listenForClassroomLessonsReviewsFromFirebase() {
  return function (dispatch) {
    reviewsRef.on('value', (snapshot) => {
      if (snapshot && snapshot.val()) {
        dispatch(updateClassroomLessonsReviews(snapshot.val()))
      }
    })
  }
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

export function addSlide(editionUid: string, editionQuestions: CustomizeIntF.EditionQuestions, slideType: string, cb:Function|undefined) {
  const editionQuestionRef = editionQuestionsRef.child(editionUid);
  const newEdition: CustomizeIntF.EditionQuestions = _.merge({}, editionQuestions)
  const newSlide: IntF.Question = lessonSlideBoilerplates[slideType]
  newEdition.questions.splice(-1, 0, newSlide)
  editionQuestionRef.set(newEdition);
  if (cb) {
    cb(Number(newEdition.questions.length) - 2)
  }
}

export function deleteEditionSlide(editionID, slideID, slides) {
  const slidesRef = editionQuestionsRef.child(`${editionID}/questions/`)
  const newArray = _.compact(Object.keys(slides).map(slideKey => {
    if (slideKey != slideID ) {
      return slides[slideKey]
    }
  }))
  slidesRef.set(newArray);
}

export function addScriptItem(editionID: string, slideID: string, slide: IntF.Question, scriptItemType: string, cb: Function|undefined) {
  const newSlide = _.merge({}, slide)
  newSlide.data.teach.script.push(scriptItemBoilerplates[scriptItemType])
  const slideRef = editionQuestionsRef.child(`${editionID}/questions/${slideID}`)
  slideRef.set(newSlide)
  if (cb) {
    cb(newSlide.data.teach.script.length - 1)
  }
}

export function deleteScriptItem(editionID, slideID, scriptItemID, script) {
  const scriptRef = editionQuestionsRef.child(`${editionID}/questions/${slideID}/data/teach/script`)
  const newArray = _.compact(Object.keys(script).map(scriptKey => {
    if (scriptKey != scriptItemID ) {
      return script[scriptKey]
    }
  }))
  scriptRef.set(newArray);
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

export function saveEditionSlide(editionID, slideID, slideData, cb) {
  editionQuestionsRef
    .child(`${editionID}/questions/${slideID}/data`)
    .set(slideData)
  if (cb) {
    cb()
  }
}

export function saveEditionScriptItem(editionID, slideID, scriptItemID, scriptItem, cb) {
  editionQuestionsRef
    .child(`${editionID}/questions/${slideID}/data/teach/script/${scriptItemID}/`)
    .set(scriptItem)
  if (cb) {
    cb()
  }
}

export function deleteLesson(classroomLessonID) {
  socket.emit('deleteClassroomLesson', classroomLessonID)
}

export function deleteEdition(editionID) {
  editionMetadataRef.child(editionID).remove();
  editionQuestionsRef.child(editionID).remove();
}

export function updateSlideScriptItems(editionID, slideID, scriptItems) {
  editionQuestionsRef
    .child(`${editionID}/questions/${slideID}/data/teach/script/`)
    .set(scriptItems)
}

export function updateEditionSlides(editionID, slides) {
  editionQuestionsRef
    .child(`${editionID}/questions/`)
    .set(slides)
}

export function updateClassroomLessonDetails(classroomLessonID, classroomLesson) {
  classroomLesson.id = classroomLessonID
  socket.emit('createOrUpdateClassroomLesson', classroomLesson)
}

export function updateEditionDetails(editionID, edition) {
  editionMetadataRef.child(editionID).set(edition)
}

export function clearClassroomLessonFromStore() {
  return ({type: C.CLEAR_CLASSROOM_LESSON_DATA})
}
