const C = require('../constants').default;

const moment = require('moment');

import Pusher from 'pusher-js';
// Put 'pusher' on global window for TypeScript validation
declare global {
  interface Window { pusher: any }
}

import _ from 'underscore';
import { goBack } from 'react-router-redux';
import { submitResponse } from './responses';
import { Questions, Question, FocusPoint, IncorrectSequence } from '../interfaces/questions'
import {
  QuestionApi,
  FocusPointApi,
  IncorrectSequenceApi,
  FILL_IN_BLANKS_TYPE
} from '../libs/questions_api'
import { LessonApi, TYPE_CONNECT_LESSON } from '../libs/lessons_api'
import lessonActions from '../actions/lessons'

// called when the app starts. this means we immediately download all questions, and
// then receive all questions again as soon as anyone changes anything.
function startListeningToQuestions() {
  return loadQuestions();
}

function loadQuestions() {
  return (dispatch, getState) => {
    QuestionApi.getAll(FILL_IN_BLANKS_TYPE).then((questions) => {
      dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: questions, });
    });
  };
}

function loadQuestion(uid) {
  return (dispatch, getState) => {
    QuestionApi.get(uid).then((question: Question) => {
      dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTION_DATA, uid: uid, data: question, });
    });
  }
}

function loadSpecifiedQuestions(uids) {
  return (dispatch, getState) => {
    const requestPromises: Promise<any>[] = [];
    uids.forEach((uid) => {
      requestPromises.push(QuestionApi.get(uid));
    });
    const allPromises = Promise.all(requestPromises);
    const questionData = {};
    allPromises.then((results) => {
      results.forEach((result, index) => {
        questionData[uids[index]] = result;
      });
      dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: questionData, });
    });
  }
}


function startQuestionEdit(qid) {
  return { type: C.START_FILL_IN_BLANK_QUESTION_EDIT, qid, };
}

function cancelQuestionEdit(qid) {
  return { type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, };
}

function submitQuestionEdit(qid, content) {
  return (dispatch, getState) => {
    dispatch({ type: C.SUBMIT_FILL_IN_BLANK_QUESTION_EDIT, qid, });
    QuestionApi.update(qid, content).then( () => {
      dispatch({ type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, });
      dispatch(loadQuestion(qid));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      const action = goBack();
      dispatch(action);
    }).catch( (error) => {
      dispatch({ type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    })
  };
}
function toggleNewQuestionModal() {
  return { type: C.TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL, };
}

function submitNewQuestion(content, response, lessonID) {
  return (dispatch, getState) => {
    dispatch({ type: C.AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
    QuestionApi.create(FILL_IN_BLANKS_TYPE, content).then((question) => {
      dispatch({ type: C.RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
      response.questionUID = Object.keys(question)[0];
      response.gradeIndex = `human${response.questionUID}`;
      dispatch(submitResponse(response));
      dispatch(loadQuestion(response.questionUID));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      const lessonQuestion = {key: response.questionUID, questionType: C.INTERNAL_FILL_IN_BLANK_TYPE}
      dispatch({ type: C.SUBMIT_LESSON_EDIT, cid: lessonID, });
      LessonApi.addQuestion(TYPE_CONNECT_LESSON, lessonID, lessonQuestion).then( () => {
        dispatch({ type: C.FINISH_LESSON_EDIT, cid: lessonID, });
        dispatch(lessonActions.loadLesson(lessonID));
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Question successfully added to lesson!', });
      }).catch( (error) => {
        dispatch({ type: C.FINISH_LESSON_EDIT, cid: lessonID, });
        dispatch({ type: C.DISPLAY_ERROR, error: `Add to lesson failed! ${error}`, });
      });
    }, (error) => {
      dispatch({ type: C.RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
    });
  };
}

function submitNewFocusPoint(qid, data) {
  return (dispatch, getState) => {
    FocusPointApi.create(qid, data).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  }
}

function submitEditedFocusPoint(qid, data, fpid) {
  return (dispatch, getState) => {
    FocusPointApi.update(qid, fpid, data).then(() => {
      dispatch(loadQuestion(qid));
    }).catch((error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function submitBatchEditedFocusPoint(qid, data) {
  return (dispatch, getState) => {
    FocusPointApi.updateAllForQuestion(qid, data).then(() => {
      dispatch(loadQuestion(qid));
    }).catch( (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function deleteFocusPoint(qid, fpid) {
  return (dispatch, getState) => {
    FocusPointApi.remove(qid, fpid).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

function submitNewIncorrectSequence(qid, data) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.create(qid, data).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function submitEditedIncorrectSequence(qid, data, seqid) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.update(qid, seqid, data).then(() => {
      dispatch(loadQuestion(qid));
    }).catch( (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function deleteIncorrectSequence(qid, seqid) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.remove(qid, seqid).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

export default {
  startListeningToQuestions,
  loadQuestions,
  loadQuestion,
  loadSpecifiedQuestions,
  startQuestionEdit,
  cancelQuestionEdit,
  submitQuestionEdit,
  toggleNewQuestionModal,
  submitNewQuestion,
  submitNewFocusPoint,
  submitEditedFocusPoint,
  submitBatchEditedFocusPoint,
  deleteFocusPoint,
  submitNewIncorrectSequence,
  submitEditedIncorrectSequence,
  deleteIncorrectSequence
}
