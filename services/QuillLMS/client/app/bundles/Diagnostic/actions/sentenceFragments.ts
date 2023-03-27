const C = require('../constants').default;
import { push } from 'react-router-redux';
import { Question } from '../interfaces/questions';
import {
  FocusPointApi,
  IncorrectSequenceApi, QuestionApi, SENTENCE_FRAGMENTS_TYPE
} from '../libs/questions_api';
import { submitResponse } from './responses';
import sessionActions from './sessions';

function startListeningToSentenceFragments() {
  return loadSentenceFragments();
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
    QuestionApi.get(uid).then((question: Question) => {
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
      sessionActions.populateQuestions("SF", questionData, true)
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

function submitSentenceFragmentEdit(sfid, content) {
  return (dispatch, getState) => {
    dispatch({ type: C.SUBMIT_SENTENCE_FRAGMENT_EDIT, sfid, });
    QuestionApi.update(sfid, content).then( () => {
      dispatch({ type: C.FINISH_SENTENCE_FRAGMENT_EDIT, sfid, });
      dispatch(loadSentenceFragment(sfid));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
    }).catch((error) => {
      dispatch({ type: C.FINISH_QUESTION_EDIT, sfid, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    });
  };
}

function getUsedSequences(qid) {
  return (dispatch, getState) => {
    const existingIncorrectSeqs = getState().sentenceFragments.data[qid].incorrectSequences
    const usedSeqs: string[] = []
    if (existingIncorrectSeqs) {
      Object.values(existingIncorrectSeqs).forEach((inSeq: any) => {
        const phrases = inSeq.text.split('|||')
        phrases.forEach((p) => {
          usedSeqs.push(p)
        })
      })
    }
    dispatch(setUsedSequences(qid, usedSeqs));
  }
}

function submitNewIncorrectSequence(sfid, data) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.create(sfid, data).then(() => {
      dispatch(loadSentenceFragment(sfid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function submitEditedIncorrectSequence(sfid, data, sesfid) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.update(sfid, sesfid, data).then(() => {
      dispatch(loadSentenceFragment(sfid));
    }).catch((error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function deleteIncorrectSequence(sfid, sesfid) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.remove(sfid, sesfid).then(() => {
      dispatch(loadSentenceFragment(sfid));
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

function submitNewFocusPoint(sfid, data) {
  return (dispatch, getState) => {
    FocusPointApi.create(sfid, data).then(() => {
      dispatch(loadSentenceFragment(sfid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  }
}

function submitEditedFocusPoint(sfid, data, fpid) {
  return (dispatch, getState) => {
    FocusPointApi.update(sfid, fpid, data).then(() => {
      dispatch(loadSentenceFragment(sfid));
    }).catch((error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function submitBatchEditedFocusPoint(sfid, data) {
  return (dispatch, getState) => {
    FocusPointApi.updateAllForQuestion(sfid, data).then(() => {
      dispatch(loadSentenceFragment(sfid));
    }).catch((error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function deleteFocusPoint(sfid, fpid) {
  return (dispatch, getState) => {
    FocusPointApi.remove(sfid, fpid).then(() => {
      dispatch(loadSentenceFragment(sfid));
    }, (error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

function setUsedSequences(qid, seq) {
  return {type: C.SET_USED_SEQUENCES, qid, seq}
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
  getUsedSequences,
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
