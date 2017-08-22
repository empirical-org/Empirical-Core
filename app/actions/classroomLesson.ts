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

export function addSlide(classroomLessonUid: string, classroomLesson: IntF.ClassroomLesson, slideType: string) {
  const lessonRef = classroomLessonsRef.child(classroomLessonUid);
  const newLesson: IntF.ClassroomLesson = _.merge({}, classroomLesson)
  newLesson.questions.splice(-1, 0, lessonSlideBoilerplates[slideType])
  lessonRef.set(newLesson);
}



export function addScriptItem(classroomLessonUid: string, slideID: string, slide: IntF.Question, scriptItemType: string) {
  const newSlide = _.merge({}, slide)
  newSlide.data.teach.script.push(scriptItemBoilerplates[scriptItemType])
  const slideRef = classroomLessonsRef.child(`${classroomLessonUid}/questions/${slideID}`)
  slideRef.set(newSlide)
}

export function addLesson(lessonName) {
  const newLesson = lessonBoilerplate(lessonName)
  const newLessonKey = classroomLessonsRef.push().key
  classroomLessonsRef.child(newLessonKey).set(newLesson)
}

export function saveClassroomLessonSlide(classroomLessonID, slideID, slideData) {
  classroomLessonsRef
    .child(`${classroomLessonID}/questions/${slideID}/data`)
    .set(slideData)
}

export function saveClassroomLessonScriptItem(classroomLessonID, slideID, scriptItemID, scriptItem) {
  classroomLessonsRef
    .child(`${classroomLessonID}/questions/${slideID}/data/teach/script/${scriptItemID}/`)
    .set(scriptItem)
}
