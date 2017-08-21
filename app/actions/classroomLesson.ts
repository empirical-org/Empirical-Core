declare function require(name:string);
import  C from '../constants';
import rootRef, { firebase } from '../libs/firebase';
const classroomLessonsRef = rootRef.child('classroom_lessons');
import _ from 'lodash'

import lessonSlideTypes from '../components/classroomLessons/shared/lessonSlideTypes'
import scriptItemTypes from '../components/classroomLessons/shared/scriptItemTypes'

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

export function addSlide(classroomLessonUid: string, slideType: string) {
  const lessonRef = classroomLessonsRef.child(classroomLessonUid)
  lessonRef.once('value', (snapshot) => {
    const lesson = snapshot.val()
    if (lesson) {
      const newLesson = _.merge({}, lesson)
      newLesson.questions.splice(-1, 0, lessonSlideTypes[slideType])
      lessonRef.set(newLesson)
    }
  });
}

export function addScriptItem(classroomLessonUid: string, slideID: string, scriptItemType: string) {
  const slideRef = classroomLessonsRef.child(`${classroomLessonUid}/questions/${slideID}`)
  slideRef.once('value', (snapshot) => {
    const slide = snapshot.val()
    if (slide) {
      const newSlide = _.merge({}, slide)
      newSlide.data.teach.script.push(scriptItemTypes[scriptItemType])
      slideRef.set(newSlide)
    }
  });
}
