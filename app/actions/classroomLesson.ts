declare function require(name:string);
import  C from '../constants';
import rootRef, { firebase } from '../libs/firebase';
const classroomSessionsRef = rootRef.child('classroom_lessons');

export function getClassLessonFromFirebase(classroomLessonUid: string) {
  return function (dispatch) {
    classroomSessionsRef.child(classroomLessonUid).once('value', (snapshot) => {
      dispatch(updateClassroomLesson(snapshot.val()));
    });
  };
}

export function updateClassroomLesson(data) {
  return {
    type: C.UPDATE_CLASSROOM_LESSON_DATA,
    data,
  }
}
