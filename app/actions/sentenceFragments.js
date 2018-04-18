const C = require('../constants').default;
import pathwaysActions from './pathways.js';
import rootRef from '../libs/firebase';
import { submitResponse } from './responses';
import { push } from 'react-router-redux';
let	sentenceFragmentsRef = rootRef.child('sentenceFragments'),
moment = require('moment');
import _ from 'lodash';

// called when the app starts. this means we immediately download all sentenceFragments, and
// then receive all sentenceFragments again as soon as anyone changes anything.
function startListeningToSentenceFragments() {
  return function (dispatch, getState) {
    sentenceFragmentsRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: snapshot.val(), });
    });
  };
}

function loadSentenceFragments() {
  return function (dispatch, getState) {
    sentenceFragmentsRef.once('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: snapshot.val(), });
    });
  };
}
function startSentenceFragmentEdit(sfid) {
  return { type: C.START_SENTENCE_FRAGMENT_EDIT, sfid, };
}
function cancelSentenceFragmentEdit(sfid) {
  return { type: C.FINISH_SENTENCE_FRAGMENT_EDIT, sfid, };
}
// deleteSentenceFragment(sfid) {
//   return function (dispatch, getState) {
//     dispatch({ type: C.SUBMIT_SENTENCE_FRAGMENT_EDIT, sfid, });
//     sentenceFragmentsRef.child(sfid).remove((error) => {
//       dispatch({ type: C.FINISH_SENTENCE_FRAGMENT_EDIT, sfid, });
//       if (error) {
//         dispatch({ type: C.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
//       } else {
//         dispatch({ type: C.DISPLAY_MESSAGE, message: 'SentenceFeedback successfully deleted!', });
//       }
//     });
//   };
// }
function submitSentenceFragmentEdit(sfid, content) {
  return function (dispatch, getState) {
    dispatch({ type: C.SUBMIT_SENTENCE_FRAGMENT_EDIT, sfid, });
    sentenceFragmentsRef.child(sfid).update(content, (error) => {
      dispatch({ type: C.FINISH_SENTENCE_FRAGMENT_EDIT, sfid, });
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }
    });
  };
}
function submitNewIncorrectSequence(sfid, data) {
  return (dispatch, getState) => {
    sentenceFragmentsRef.child(`${sfid}/incorrectSequences`).push(data, (error) => {
      if (error) {
        alert(`Submission failed! ${error}`);
      }
    });
  };
}
function submitEditedIncorrectSequence(sfid, data, sesfid) {
  return (dispatch, getState) => {
    sentenceFragmentsRef.child(`${sfid}/incorrectSequences/${sesfid}`).update(data, (error) => {
      if (error) {
        alert(`Submission failed! ${error}`);
      }
    });
  };
}
function deleteIncorrectSequence(sfid, sesfid) {
  return (dispatch, getState) => {
    sentenceFragmentsRef.child(`${sfid}/incorrectSequences/${sesfid}`).remove((error) => {
      if (error) {
        alert(`Delete failed! ${error}`);
      }
    });
  };
}
function toggleNewSentenceFeedbackModal() {
  return { type: C.TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL, };
}

function submitNewFocusPoint(sfid, data) {
  sentenceFragmentsRef.child(`${sfid}/focusPoints`).push(data, (error) => {
    if (error) {
      alert(`Submission failed! ${error}`);
    } else {
      console.log('data', data)
    }
  });
}

function submitNewSentenceFragment(content, response) {
  return (dispatch, getState) => {
    dispatch({ type: C.AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE, });
    const newRef = sentenceFragmentsRef.push(content, (error) => {
      dispatch({ type: C.RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE, });
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else {
        response.questionUID = newRef.key;
        response.gradeIndex = `human${newRef.key}`;
        dispatch(submitResponse(response));
        const focusPoints = content.prompt.split(' ').map((w) => {
          const word = w.replace(/[^\w]|_/g, '')
          const caseModifiedWord = word.toLowerCase() !== word ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
          return { text: `${word}|||${caseModifiedWord}`, feedback: `Try again. You may be missing the word "${word.toLowerCase()}".` }
        })
        focusPoints.forEach(fp => submitNewFocusPoint(newRef.key, fp))
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        const action = push(`/admin/sentence-fragments/${newRef.key}`);
        dispatch(action);
      }
    });
  };
}

function submitEditedFocusPoint(sfid, data, fpid) {
  return (dispatch, getState) => {
    sentenceFragmentsRef.child(`${sfid}/focusPoints/${fpid}`).update(data, (error) => {
      if (error) {
        alert(`Submission failed! ${error}`);
      }
    });
  };
}

function submitBatchEditedFocusPoint(sfid, data) {
  return (dispatch, getState) => {
    sentenceFragmentsRef.child(`${sfid}/focusPoints/`).set(data, (error) => {
      if (error) {
        alert(`Submission failed! ${error}`);
      }
    });
  };
}

function deleteFocusPoint(sfid, fpid) {
  return (dispatch, getState) => {
    sentenceFragmentsRef.child(`${sfid}/focusPoints/${fpid}`).remove((error) => {
      if (error) {
        alert(`Delete failed! ${error}`);
      }
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
