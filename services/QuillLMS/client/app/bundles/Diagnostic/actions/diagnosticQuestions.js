const C = require('../constants').default;

import rootRef from '../libs/firebase';

let	diagnosticQuestionsRef = rootRef.child('diagnosticQuestions'),
  moment = require('moment');

import _ from 'lodash';
import { push } from 'react-router-redux';

import pathwaysActions from './pathways';
import { submitResponse } from './responses';

const actions = {
	// called when the app starts. this means we immediately download all diagnosticQuestions, and
	// then receive all diagnosticQuestions again as soon as anyone changes anything.
  startListeningToDiagnosticQuestions() {
    return function (dispatch, getState) {
      diagnosticQuestionsRef.on('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_DIAGNOSTIC_QUESTIONS_DATA, data: snapshot.val(), });
      });
    };
  },
  loadDiagnosticQuestions() {
    return function (dispatch, getState) {
      diagnosticQuestionsRef.once('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_DIAGNOSTIC_QUESTIONS_DATA, data: snapshot.val(), });
      });
    };
  },
  startQuestionEdit(qid) {
    return { type: C.START_DIAGNOSTIC_QUESTION_EDIT, qid, };
  },
  cancelQuestionEdit(qid) {
    return { type: C.FINISH_DIAGNOSTIC_QUESTION_EDIT, qid, };
  },
  submitQuestionEdit(qid, content) {
    return (dispatch, getState) => {
      dispatch({ type: C.SUBMIT_DIAGNOSTIC_QUESTION_EDIT, qid, });
      diagnosticQuestionsRef.child(qid).update(content, (error) => {
        dispatch({ type: C.FINISH_DIAGNOSTIC_QUESTION_EDIT, qid, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
        } else {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
        }
      });
    };
  },
  submitEditedFocusPoint(qid, data, fpid) {
    return function (dispatch, getState) {
      diagnosticQuestionsRef.child(`${qid}/focusPoints/${fpid}`).update(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  toggleNewQuestionModal() {
    return { type: C.TOGGLE_NEW_DIAGNOSTIC_QUESTION_MODAL, };
  },
  submitNewQuestion(content, response) {
    return (dispatch, getState) => {
      dispatch({ type: C.AWAIT_NEW_DIAGNOSTIC_QUESTION_RESPONSE, });
      const newRef = diagnosticQuestionsRef.push(content, (error) => {
        dispatch({ type: C.RECEIVE_NEW_DIAGNOSTIC_QUESTION_RESPONSE, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else {
          response.questionUID = newRef.key;
          response.gradeIndex = `human${newRef.key}`;
          dispatch(submitResponse(response));
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          const action = push(`/admin/diagnostic-questions/${newRef.key}`);
          dispatch(action);
        }
      });
    };
  },
  submitNewFocusPoint(qid, data) {
    return function (dispatch, getState) {
      diagnosticQuestionsRef.child(`${qid}/focusPoints`).push(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  startResponseEdit(qid, rid) {
    return { type: C.START_DIAGNOSTIC_RESPONSE_EDIT, qid, rid, };
  },
  cancelResponseEdit(qid, rid) {
    return { type: C.FINISH_DIAGNOSTIC_RESPONSE_EDIT, qid, rid, };
  },
  startChildResponseView(qid, rid) {
    return { type: C.START_CHILD_DIAGNOSTIC_RESPONSE_VIEW, qid, rid, };
  },
  cancelChildResponseView(qid, rid) {
    return { type: C.CANCEL_CHILD_DIAGNOSTIC_RESPONSE_VIEW, qid, rid, };
  },
  startFromResponseView(qid, rid) {
    return { type: C.START_FROM_DIAGNOSTIC_RESPONSE_VIEW, qid, rid, };
  },
  cancelFromResponseView(qid, rid) {
    return { type: C.CANCEL_FROM_DIAGNOSTIC_RESPONSE_VIEW, qid, rid, };
  },
  startToResponseView(qid, rid) {
    return { type: C.START_TO_DIAGNOSTIC_RESPONSE_VIEW, qid, rid, };
  },
  cancelToResponseView(qid, rid) {
    return { type: C.CANCEL_TO_DIAGNOSTIC_RESPONSE_VIEW, qid, rid, };
  },
};

export default actions;
