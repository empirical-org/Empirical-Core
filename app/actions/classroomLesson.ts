declare function require(name:string);
import  C from '../constants';
import rootRef, { firebase } from '../libs/firebase';
const classroomLessonsRef = rootRef.child('classroom_lessons');
import _ from 'lodash'

import * as IntF from 'components/classroomLessons/interfaces';

import lessonBoilerplate from '../components/classroomLessons/shared/classroomLessonBoilerplate'
import lessonSlideBoilerplates from '../components/classroomLessons/shared/lessonSlideBoilerplates'
import scriptItemBoilerplates from '../components/classroomLessons/shared/scriptItemBoilerplates'

export function getClassLessonFromFirebase(classroomLessonUid: string) {
  return function (dispatch) {
    console.log("Fetching")
    classroomLessonsRef.child(classroomLessonUid).once('value', (snapshot) => {
      console.log("Fetched")
      if (snapshot.val()) {
        dispatch(updateClassroomLesson(snapshot.val()));
      } else {
        dispatch({type: C.NO_LESSON_ID, data: classroomLessonUid})
      }
    });
  };
}

export function updateClassroomLesson(data) {
  return {
    type: C.RECEIVE_CLASSROOM_LESSON_DATA,
    data,
  }
}

export function listenForClassroomLessonsFromFirebase() {
  return function (dispatch) {
    classroomLessonsRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        dispatch(updateClassroomLessons(snapshot.val()))
      } else {
        dispatch({type: C.NO_LESSONS})
      }
    })
  }
}

export function updateClassroomLessons(data) {
  return ({type: C.RECEIVE_CLASSROOM_LESSONS_DATA, data: data})
}

export function addSlide(classroomLessonUid: string, classroomLesson: IntF.ClassroomLesson, slideType: string, cb:Function|undefined) {
  const lessonRef = classroomLessonsRef.child(classroomLessonUid);
  const newLesson: IntF.ClassroomLesson = _.merge({}, classroomLesson)
  const newSlide: IntF.Question = lessonSlideBoilerplates[slideType]
  newLesson.questions.splice(-1, 0, newSlide)
  lessonRef.set(newLesson);
  if (cb) {
    cb(Number(newLesson.questions.length) - 2)
  }
}

export function deleteClassroomLessonSlide(classroomLessonID, slideID, slides) {
  const slidesRef = classroomLessonsRef.child(`${classroomLessonID}/questions/`)
  const newArray = _.compact(Object.keys(slides).map(slideKey => {
    if (slideKey != slideID ) {
      return slides[slideKey]
    }
  }))
  slidesRef.set(newArray);
}

export function addScriptItem(classroomLessonUid: string, slideID: string, slide: IntF.Question, scriptItemType: string, cb: Function|undefined) {
  const newSlide = _.merge({}, slide)
  newSlide.data.teach.script.push(scriptItemBoilerplates[scriptItemType])
  const slideRef = classroomLessonsRef.child(`${classroomLessonUid}/questions/${slideID}`)
  slideRef.set(newSlide)
  if (cb) {
    cb(newSlide.data.teach.script.length - 1)
  }
}

export function deleteScriptItem(classroomLessonID, slideID, scriptItemID, script) {
  const scriptRef = classroomLessonsRef.child(`${classroomLessonID}/questions/${slideID}/data/teach/script`)
  const newArray = _.compact(Object.keys(script).map(scriptKey => {
    if (scriptKey != scriptItemID ) {
      return script[scriptKey]
    }
  }))
  scriptRef.set(newArray);
}

export function addLesson(lessonName, cb) {
  const newLesson = lessonBoilerplate(lessonName)
  const newLessonKey = classroomLessonsRef.push().key
  classroomLessonsRef.child(newLessonKey).set(newLesson)
  if (cb) {
    cb(newLessonKey)
  }
}

export function saveClassroomLessonSlide(classroomLessonID, slideID, slideData, cb) {
  classroomLessonsRef
    .child(`${classroomLessonID}/questions/${slideID}/data`)
    .set(slideData)
  if (cb) {
    cb()
  }
}

export function saveClassroomLessonScriptItem(classroomLessonID, slideID, scriptItemID, scriptItem, cb) {
  classroomLessonsRef
    .child(`${classroomLessonID}/questions/${slideID}/data/teach/script/${scriptItemID}/`)
    .set(scriptItem)
  if (cb) {
    cb()
  }
}

export function deleteLesson(classroomLessonID) {
  classroomLessonsRef.child(classroomLessonID).remove();
}
export function updateSlideScriptItems(classroomLessonID, slideID, scriptItems) {
  classroomLessonsRef
    .child(`${classroomLessonID}/questions/${slideID}/data/teach/script/`)
    .set(scriptItems)
}

export function updateClassroomLessonSlides(classroomLessonID, slides) {
  classroomLessonsRef
    .child(`${classroomLessonID}/questions/`)
    .set(slides)
}

export function updateClassroomLessonDetails(classroomLessonID, classroomLesson) {
  classroomLessonsRef.child(classroomLessonID).set(classroomLesson)
}
