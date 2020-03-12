const C = require('../constants').default;
import pathwaysActions from './pathways.js';
import rootRef from '../libs/firebase';
import { submitResponse } from './responses';
import { push } from 'react-router-redux';
let	sentenceFragmentsRef = rootRef.child('sentenceFragments'),
moment = require('moment');
import _ from 'lodash';

import {
  QuestionApi,
  FocusPointApi,
  IncorrectSequenceApi,
  SENTENCE_FRAGMENTS_TYPE
} from '../libs/questions_api'

function startListeningToSentenceFragments() {
  return (dispatch, getState) => {
    return loadSentenceFragments();
  };
}

function loadSentenceFragments() {
  return (dispatch, getState) => {
    QuestionApi.getAll(SENTENCE_FRAGMENTS_TYPE).then((questions) => {
      dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: questions, });
    });
  };
}

function loadSentenceFragment(uid) {
  return (dispatch, getState) => {
    QuestionApi.get(uid).then((question) => {
      dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENT_DATA, uid: uid, data: question, });
    });
  }
}

function loadSpecifiedSentenceFragments(uids) {
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
      dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: questionData, });
    });
  }
}

function startSentenceFragmentEdit(sfid) {
  return { type: C.START_SENTENCE_FRAGMENT_EDIT, sfid, };
}
function cancelSentenceFragmentEdit(sfid) {
  return { type: C.FINISH_SENTENCE_FRAGMENT_EDIT, sfid, };
}

function submitSentenceFragmentEdit(qid, content) {
  return (dispatch, getState) => {
    dispatch({ type: C.SUBMIT_SENTENCE_FRAGMENT_EDIT, qid, });
    QuestionApi.update(qid, content).then( () => {
      dispatch({ type: C.FINISH_SENTENCE_FRAGMENT_EDIT, qid, });
      dispatch(loadSentenceFragment(qid));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
    }, (error) => {
      dispatch({ type: C.FINISH_QUESTION_EDIT, qid, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    });
  };
}

function submitNewIncorrectSequence(qid, data) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.create(qid, data).then(() => {
      dispatch(loadSentenceFragment(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function submitEditedIncorrectSequence(qid, data, seqid) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.update(qid, seqid, data).then(() => {
      dispatch(loadSentenceFragment(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function deleteIncorrectSequence(qid, seqid) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.remove(qid, seqid).then(() => {
      dispatch(loadSentenceFragment(qid));
    }, (error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

function toggleNewSentenceFeedbackModal() {
  return { type: C.TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL, };
}

function submitNewSentenceFragment(content, response) {
  return (dispatch, getState) => {
    dispatch({ type: C.AWAIT_NEW_QUESTION_RESPONSE, });
    QuestionApi.create(SENTENCE_FRAGMENTS_TYPE, content).then((question) => {
      dispatch({ type: C.RECEIVE_NEW_QUESTION_RESPONSE, });
      response.questionUID = Object.keys(question)[0];
      response.gradeIndex = `human${response.questionUID}`;
      dispatch(submitResponse(response));
      dispatch(loadSentenceFragment(response.questionUID));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      const action = push(`/admin/questions/${response.questionUID}`);
      dispatch(action);
    }, (error) => {
      dispatch({ type: C.RECEIVE_NEW_QUESTION_RESPONSE, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
    });
  };
}

function submitNewFocusPoint(qid, data) {
  return (dispatch, getState) => {
    FocusPointApi.create(qid, data).then(() => {
      dispatch(loadSentenceFragment(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  }
}

function submitEditedFocusPoint(qid, data, fpid) {
  return (dispatch, getState) => {
    FocusPointApi.update(qid, fpid, data).then(() => {
      dispatch(loadSentenceFragment(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function submitBatchEditedFocusPoint(qid, data) {
  return (dispatch, getState) => {
    FocusPointApi.updateAllForQuestion(qid, data).then(() => {
      dispatch(loadSentenceFragment(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function deleteFocusPoint(qid, fpid) {
  return (dispatch, getState) => {
    FocusPointApi.remove(qid, fpid).then(() => {
      dispatch(loadSentenceFragment(qid));
    }, (error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

function startResponseEdit(sfid, rid) {
  return { type: C.START_RESPONSE_EDIT, sfid, rid, };
}
function cancelResponseEdit(sfid, rid) {
  return { type: C.FINISH_RESPONSE_EDIT, sfid, rid, };
}
function startChildResponseView(sfid, rid) {
  return { type: C.START_CHILD_RESPONSE_VIEW, sfid, rid, };
}
function cancelChildResponseView(sfid, rid) {
  return { type: C.CANCEL_CHILD_RESPONSE_VIEW, sfid, rid, };
}
function startFromResponseView(sfid, rid) {
  return { type: C.START_FROM_RESPONSE_VIEW, sfid, rid, };
}
function cancelFromResponseView(sfid, rid) {
  return { type: C.CANCEL_FROM_RESPONSE_VIEW, sfid, rid, };
}
function startToResponseView(sfid, rid) {
  return { type: C.START_TO_RESPONSE_VIEW, sfid, rid, };
}
function cancelToResponseView(sfid, rid) {
  return { type: C.CANCEL_TO_RESPONSE_VIEW, sfid, rid, };
}

export default {
  startListeningToSentenceFragments,
  loadSentenceFragments,
  loadSentenceFragment,
  loadSpecifiedSentenceFragments,
  startSentenceFragmentEdit,
  cancelSentenceFragmentEdit,
  submitSentenceFragmentEdit,
  submitNewIncorrectSequence,
  submitEditedIncorrectSequence,
  deleteIncorrectSequence,
  toggleNewSentenceFeedbackModal,
  submitNewSentenceFragment,
  submitNewFocusPoint,
  submitEditedFocusPoint,
  submitBatchEditedFocusPoint,
  deleteFocusPoint,
  startResponseEdit,
  cancelResponseEdit,
  startChildResponseView,
  cancelChildResponseView,
  startFromResponseView,
  cancelFromResponseView,
  startToResponseView,
  cancelToResponseView
};
