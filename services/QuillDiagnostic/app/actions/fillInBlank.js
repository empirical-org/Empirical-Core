const C = require('../constants').default;
import rootRef from '../libs/firebase';
const	fillInBlankQuestionsRef = rootRef.child('diagnostic_fillInBlankQuestions');
const	responsesRef = rootRef.child('responses');
const moment = require('moment');
import _ from 'lodash';
import { push } from 'react-router-redux';
import pathwaysActions from './pathways';
import { submitResponse } from './responses';

const actions = {
	// called when the app starts. this means we immediately download all questions, and
	// then receive all questions again as soon as anyone changes anything.
  startListeningToQuestions() {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.on('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: snapshot.val(), });
      });
    };
  },
  loadQuestions() {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.once('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: snapshot.val(), });
      });
    };
  },
  startQuestionEdit(qid) {
    return { type: C.START_FILL_IN_BLANK_QUESTION_EDIT, qid, };
  },
  cancelQuestionEdit(qid) {
    return { type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, };
  },
  submitQuestionEdit(qid, content) {
    return function (dispatch, getState) {
      dispatch({ type: C.SUBMIT_FILL_IN_BLANK_QUESTION_EDIT, qid, });
      fillInBlankQuestionsRef.child(qid).update(content, (error) => {
        dispatch({ type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
        } else {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
          const action = push(`/admin/fill-in-the-blanks/${qid}`);
          dispatch(action);
        }
      });
    };
  },
  toggleNewQuestionModal() {
    return { type: C.TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL, };
  },
  submitNewQuestion(content, response) {
    return (dispatch, getState) => {
      dispatch({ type: C.AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
      const newRef = fillInBlankQuestionsRef.push(content, (error) => {
        dispatch({ type: C.RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else {
          response.questionUID = newRef.key;
          response.gradeIndex = `human${newRef.key}`;
          dispatch(submitResponse(response));
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          const action = push(`/admin/fill-in-the-blanks/${newRef.key}`);
          dispatch(action);
        }
      });
    };
  },

  submitNewFocusPoint(qid, data) {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.child(`${qid}/focusPoints`).push(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  submitEditedFocusPoint(qid, data, fpid) {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.child(`${qid}/focusPoints/${fpid}`).update(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  submitBatchEditedFocusPoint(qid, data) {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.child(`${qid}/focusPoints/`).set(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  deleteFocusPoint(qid, fpid) {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.child(`${qid}/focusPoints/${fpid}`).remove((error) => {
        if (error) {
          alert(`Delete failed! ${error}`);
        }
      });
    };
  },
  submitNewIncorrectSequence(qid, data) {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.child(`${qid}/incorrectSequences`).push(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  submitEditedIncorrectSequence(qid, data, seqid) {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.child(`${qid}/incorrectSequences/${seqid}`).update(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  deleteIncorrectSequence(qid, seqid) {
    return function (dispatch, getState) {
      fillInBlankQuestionsRef.child(`${qid}/incorrectSequences/${seqid}`).remove((error) => {
        if (error) {
          alert(`Delete failed! ${error}`);
        }
      });
    };
  },
};

export default actions;
