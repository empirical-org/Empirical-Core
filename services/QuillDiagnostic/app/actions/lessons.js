const C = require('../constants').default;
import rootRef from '../libs/firebase';
const	lessonsRef = rootRef.child('diagnostics');
import { push } from 'react-router-redux';
import questionActions from './questions';
import fillInBlankActions from './fillInBlank';
import * as titleCardActions from './titleCards';
import sentenceFragmentActions from './sentenceFragments';

	// called when the app starts. this means we immediately download all quotes, and
	// then receive all quotes again as soon as anyone changes anything.

function startListeningToLessons() {
  return function (dispatch, getState) {
    lessonsRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_LESSONS_DATA, data: snapshot.val(), });
    });
  };
}

function loadLessons() {
  return function (dispatch, getState) {
    lessonsRef.once('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_LESSONS_DATA, data: snapshot.val(), });
    });
  };
}

function loadLesson(uid) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      lessonsRef.child(uid).once('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_LESSONS_DATA, data: { [uid]: snapshot.val(), } });
        resolve();
      });
    })
  }
}

function loadLessonWithQuestions(uid) {
  return (dispatch, getState) => {
    dispatch(loadLesson(uid)).then(() => {
      const fetchedLesson = getState().lessons.data[uid];
      const questionTypes = ['questions', 'fillInBlank', 'titleCards', 'sentenceFragments'];
      questionTypes.forEach((questionType) => {
        const questionUids = fetchedLesson.questions.filter((q) => q.questionType == questionType).map((q) => q.key);
        switch (questionType) {
          case 'questions':
            dispatch(questionActions.loadSpecifiedQuestions(questionUids));
            break
          case 'fillInBlank':
            dispatch(fillInBlankActions.loadSpecifiedQuestions(questionUids));
            break
          case 'titleCards':
            dispatch(titleCardActions.loadSpecifiedTitleCards(questionUids));
            break
          case 'sentenceFragments':
            dispatch(sentenceFragmentActions.loadSpecifiedSentenceFragments(questionUids));
        }
      });
    });
  }
}

function startLessonEdit(cid) {
  return { type: C.START_LESSON_EDIT, cid, };
}

function cancelLessonEdit(cid) {
  return { type: C.FINISH_LESSON_EDIT, cid, };
}

function deleteLesson(cid) {
  return function (dispatch, getState) {
    dispatch({ type: C.SUBMIT_LESSON_EDIT, cid, });
    lessonsRef.child(cid).remove((error) => {
      dispatch({ type: C.FINISH_LESSON_EDIT, cid, });
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Lesson successfully deleted!', });
      }
    });
  };
}

function submitLessonEdit(cid, content, qids) {
  return function (dispatch, getState) {
    dispatch({ type: C.SUBMIT_LESSON_EDIT, cid, });
    const cleanedContent = _.pickBy(content)
    dispatch(updateQuestions(cleanedContent, qids))
    lessonsRef.child(cid).set(cleanedContent, (error) => {
      dispatch({ type: C.FINISH_LESSON_EDIT, cid, });
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }
    });
  };
}

function updateQuestions(content, qids) {
  return function (dispatch) {
    if (content.flag) {
      qids.forEach(qid => {
        dispatch(questionActions.updateFlag(qid, content.flag))
      })
    }
    if (content.modelConceptUID) {
      qids.forEach(qid => {
        dispatch(questionActions.updateModelConceptUID(qid, content.modelConceptUID))
      })
    }
  };
}

function toggleNewLessonModal() {
  return { type: C.TOGGLE_NEW_LESSON_MODAL, };
}

function submitNewLesson(content) {
  const cleanedContent = _.pickBy(content)
  return function (dispatch, getState) {
    dispatch({ type: C.AWAIT_NEW_LESSON_RESPONSE, });
    var newRef = lessonsRef.push(cleanedContent, (error) => {
      dispatch({ type: C.RECEIVE_NEW_LESSON_RESPONSE, });
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else {
        const qids = cleanedContent.questions ? cleanedContent.questions.map(q => q.key) : []
        dispatch(updateQuestions(cleanedContent, qids))
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        const action = push(`/admin/lessons/${newRef.key}`);
        dispatch(action);
      }
    });
  };
}

export default {
  startListeningToLessons,
  loadLessons,
  loadLesson,
  loadLessonWithQuestions,
  startLessonEdit,
  cancelLessonEdit,
  deleteLesson,
  submitLessonEdit,
  updateQuestions,
  toggleNewLessonModal,
  submitNewLesson
};
