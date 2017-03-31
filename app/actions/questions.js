const C = require('../constants').default;
import rootRef from '../libs/firebase';
const	questionsRef = rootRef.child('questions');
const	responsesRef = rootRef.child('responses');
const moment = require('moment');
import _ from 'lodash';
import { push } from 'react-router-redux';
import pathwaysActions from './pathways';
import { submitNewResponse } from './responses';

module.exports = {
	// called when the app starts. this means we immediately download all questions, and
	// then receive all questions again as soon as anyone changes anything.
  startListeningToQuestions() {
    return function (dispatch, getState) {
      questionsRef.on('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_QUESTIONS_DATA, data: snapshot.val(), });
      });
    };
  },
  loadQuestions() {
    return function (dispatch, getState) {
      questionsRef.once('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_QUESTIONS_DATA, data: snapshot.val(), });
      });
    };
  },
  startQuestionEdit(qid) {
    return { type: C.START_QUESTION_EDIT, qid, };
  },
  cancelQuestionEdit(qid) {
    return { type: C.FINISH_QUESTION_EDIT, qid, };
  },
  deleteQuestion(qid) {
    return function (dispatch, getState) {
      dispatch({ type: C.SUBMIT_QUESTION_EDIT, qid, });
      questionsRef.child(qid).remove((error) => {
        dispatch({ type: C.FINISH_QUESTION_EDIT, qid, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
        } else {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Question successfully deleted!', });
        }
      });
    };
  },
  submitQuestionEdit(qid, content) {
    return function (dispatch, getState) {
      dispatch({ type: C.SUBMIT_QUESTION_EDIT, qid, });
      questionsRef.child(qid).update(content, (error) => {
        dispatch({ type: C.FINISH_QUESTION_EDIT, qid, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
        } else {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
        }
      });
    };
  },
  toggleNewQuestionModal() {
    return { type: C.TOGGLE_NEW_QUESTION_MODAL, };
  },
  submitNewQuestion(content, response) {
    return (dispatch, getState) => {
      dispatch({ type: C.AWAIT_NEW_QUESTION_RESPONSE, });
      const newRef = questionsRef.push(content, (error) => {
        dispatch({ type: C.RECEIVE_NEW_QUESTION_RESPONSE, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else {
          response.questionUID = newRef.key;
          response.gradeIndex = `human${newRef.key}`;
          dispatch(submitNewResponse(response));
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          const action = push(`/admin/questions/${newRef.key}`);
          dispatch(action);
        }
      });
    };
  },

  submitNewFocusPoint(qid, data) {
    return function (dispatch, getState) {
      questionsRef.child(`${qid}/focusPoints`).push(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  submitEditedFocusPoint(qid, data, fpid) {
    return function (dispatch, getState) {
      questionsRef.child(`${qid}/focusPoints/${fpid}`).update(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  deleteFocusPoint(qid, fpid) {
    return function (dispatch, getState) {
      questionsRef.child(`${qid}/focusPoints/${fpid}`).remove((error) => {
        if (error) {
          alert(`Delete failed! ${error}`);
        }
      });
    };
  },
  submitNewConceptResult(rid, data) {
    return function (dispatch, getState) {
      responsesRef.child(`${rid}/conceptResults`).push(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  deleteConceptResult(rid, crid) {
    return function (dispatch, getState) {
      responsesRef.child(`${rid}/conceptResults/${crid}`).remove((error) => {
        if (error) {
          alert(`Delete failed! ${error}`);
        }
      });
    };
  },
  startResponseEdit(qid, rid) {
    return { type: C.START_RESPONSE_EDIT, qid, rid, };
  },
  cancelResponseEdit(qid, rid) {
    return { type: C.FINISH_RESPONSE_EDIT, qid, rid, };
  },
  startChildResponseView(qid, rid) {
    return { type: C.START_CHILD_RESPONSE_VIEW, qid, rid, };
  },
  cancelChildResponseView(qid, rid) {
    return { type: C.CANCEL_CHILD_RESPONSE_VIEW, qid, rid, };
  },
  startFromResponseView(qid, rid) {
    return { type: C.START_FROM_RESPONSE_VIEW, qid, rid, };
  },
  cancelFromResponseView(qid, rid) {
    return { type: C.CANCEL_FROM_RESPONSE_VIEW, qid, rid, };
  },
  startToResponseView(qid, rid) {
    return { type: C.START_TO_RESPONSE_VIEW, qid, rid, };
  },
  cancelToResponseView(qid, rid) {
    return { type: C.CANCEL_TO_RESPONSE_VIEW, qid, rid, };
  },
};
