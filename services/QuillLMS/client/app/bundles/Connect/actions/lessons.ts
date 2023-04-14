const C = require('../constants').default;
import { pickBy } from 'lodash';
import { push } from 'react-router-redux';
import { LessonApi, TYPE_CONNECT_LESSON } from '../libs/lessons_api';
import fillInBlankActions from './fillInBlank';
import questionActions from './questions';
import sentenceFragmentActions from './sentenceFragments';
import titleCardActions from './titleCards.ts';

// called when the app starts. this means we immediately download all quotes, and
// then receive all quotes again as soon as anyone changes anything.

const startListeningToLessons = () => {
  return loadLessons()
}

const loadLessons = () => {
  return (dispatch, getState) => {
    LessonApi.getAll(TYPE_CONNECT_LESSON).then((data) => {
      dispatch({ type: C.RECEIVE_LESSONS_DATA, data: data, });
    });
  };
}

const loadLesson = (uid) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      LessonApi.get(TYPE_CONNECT_LESSON, uid).then((data) => {
        dispatch({ type: C.RECEIVE_LESSONS_DATA, data: { [uid]: data, } });
        resolve();
      });
    })
  }
}

const loadLessonWithQuestions = (uid) => {
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

const startLessonEdit = (cid) => {
  return { type: C.START_LESSON_EDIT, cid, };
}

const cancelLessonEdit = (cid) => {
  return { type: C.FINISH_LESSON_EDIT, cid, };
}

const deleteLesson = (cid) => {
  return (dispatch, getState) => {
    dispatch({ type: C.SUBMIT_LESSON_EDIT, cid, });
    LessonApi.remove(TYPE_CONNECT_LESSON, cid).then(() => {
      dispatch({ type: C.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Lesson successfully deleted!', });
    }).catch((error) => {
      dispatch({ type: C.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
    });
  };
}

const submitLessonEdit = (cid, content, qids) => {
  return (dispatch, getState) => {
    dispatch({ type: C.SUBMIT_LESSON_EDIT, cid, });
    const cleanedContent = pickBy(content)
    if (cleanedContent.questionType != C.INTERNAL_TITLE_CARDS_TYPE) {
      dispatch(updateQuestions(cleanedContent, qids))
    }
    LessonApi.update(TYPE_CONNECT_LESSON, cid, cleanedContent).then((lesson) => {
      dispatch(loadLesson(cid))
      dispatch({ type: C.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
    }).catch((error) => {
      dispatch({ type: C.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    })
  };
}

const updateQuestions = (content, qids) => {
  return (dispatch) => {
    if (content.flag && content.flag === C.PRODUCTION) {
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

const toggleNewLessonModal = () => {
  return { type: C.TOGGLE_NEW_LESSON_MODAL, };
}

const submitNewLesson = (content) => {
  const cleanedContent = pickBy(content)
  return (dispatch, getState) => {
    dispatch({ type: C.AWAIT_NEW_LESSON_RESPONSE, });
    LessonApi.create(TYPE_CONNECT_LESSON, cleanedContent).then((lesson) => {
      const lessonUid = Object.keys(lesson)[0];
      dispatch(loadLesson(lessonUid))
      dispatch({ type: C.RECEIVE_NEW_LESSON_RESPONSE, });
      const qids = cleanedContent.questions ? cleanedContent.questions.map(q => q.key) : []
      if (cleanedContent.questionType != C.INTERNAL_TITLE_CARDS_TYPE) {
        dispatch(updateQuestions(cleanedContent, qids))
      }
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      const action = push(`/admin/lessons/${lessonUid}`);
      dispatch(action);
    }).catch((error) => {
      dispatch({ type: C.RECEIVE_NEW_LESSON_RESPONSE, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
    });
  };
}

const setFlag = (flag) => {
  return (dispatch) => {
    dispatch({ type: C.SET_LESSON_FLAG, flag, })
  };
}

export default {
  startListeningToLessons,
  loadLesson,
  loadLessonWithQuestions,
  loadLessons,
  startLessonEdit,
  cancelLessonEdit,
  deleteLesson,
  submitLessonEdit,
  updateQuestions,
  toggleNewLessonModal,
  submitNewLesson,
  setFlag
};
