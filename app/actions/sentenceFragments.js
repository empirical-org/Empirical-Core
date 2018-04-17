const C = require('../constants').default;
import pathwaysActions from './pathways.js';
import rootRef from '../libs/firebase';
import { submitResponse } from './responses';
import { push } from 'react-router-redux';
let	sentenceFragmentsRef = rootRef.child('sentenceFragments'),
moment = require('moment');
import _ from 'lodash';

const actions = {
	// called when the app starts. this means we immediately download all sentenceFragments, and
	// then receive all sentenceFragments again as soon as anyone changes anything.
  startListeningToSentenceFragments() {
    return function (dispatch, getState) {
      sentenceFragmentsRef.on('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: snapshot.val(), });
      });
    };
  },
  loadSentenceFragments() {
    return function (dispatch, getState) {
      sentenceFragmentsRef.once('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: snapshot.val(), });
      });
    };
  },
  startSentenceFragmentEdit(sfid) {
    return { type: C.START_SENTENCE_FRAGMENT_EDIT, sfid, };
  },
  cancelSentenceFragmentEdit(sfid) {
    return { type: C.FINISH_SENTENCE_FRAGMENT_EDIT, sfid, };
  },
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
  // },
  submitSentenceFragmentEdit(sfid, content) {
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
  },
  submitNewIncorrectSequence(sfid, data) {
    return (dispatch, getState) => {
      sentenceFragmentsRef.child(`${sfid}/incorrectSequences`).push(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  submitEditedIncorrectSequence(sfid, data, sesfid) {
    return (dispatch, getState) => {
      sentenceFragmentsRef.child(`${sfid}/incorrectSequences/${sesfid}`).update(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },
  deleteIncorrectSequence(sfid, sesfid) {
    return (dispatch, getState) => {
      sentenceFragmentsRef.child(`${sfid}/incorrectSequences/${sesfid}`).remove((error) => {
        if (error) {
          alert(`Delete failed! ${error}`);
        }
      });
    };
  },
  toggleNewSentenceFeedbackModal() {
    return { type: C.TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL, };
  },
  submitNewSentenceFragment(content, response) {
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
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          const action = push(`/admin/sentence-fragments/${newRef.key}`);
          dispatch(action);
        }
      });
    };
  },
  submitNewFocusPoint(sfid, data) {
    return (dispatch, getState) => {
      sentenceFragmentsRef.child(`${sfid}/focusPoints`).push(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },

  submitEditedFocusPoint(sfid, data, fpid) {
    return (dispatch, getState) => {
      sentenceFragmentsRef.child(`${sfid}/focusPoints/${fpid}`).update(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },

  submitBatchEditedFocusPoint(sfid, data) {
    return (dispatch, getState) => {
      sentenceFragmentsRef.child(`${sfid}/focusPoints/`).set(data, (error) => {
        if (error) {
          alert(`Submission failed! ${error}`);
        }
      });
    };
  },

  deleteFocusPoint(sfid, fpid) {
    return (dispatch, getState) => {
      sentenceFragmentsRef.child(`${sfid}/focusPoints/${fpid}`).remove((error) => {
        if (error) {
          alert(`Delete failed! ${error}`);
        }
      });
    };
  },
  startResponseEdit(sfid, rid) {
    return { type: C.START_RESPONSE_EDIT, sfid, rid, };
  },
  cancelResponseEdit(sfid, rid) {
    return { type: C.FINISH_RESPONSE_EDIT, sfid, rid, };
  },
  startChildResponseView(sfid, rid) {
    return { type: C.START_CHILD_RESPONSE_VIEW, sfid, rid, };
  },
  cancelChildResponseView(sfid, rid) {
    return { type: C.CANCEL_CHILD_RESPONSE_VIEW, sfid, rid, };
  },
  startFromResponseView(sfid, rid) {
    return { type: C.START_FROM_RESPONSE_VIEW, sfid, rid, };
  },
  cancelFromResponseView(sfid, rid) {
    return { type: C.CANCEL_FROM_RESPONSE_VIEW, sfid, rid, };
  },
  startToResponseView(sfid, rid) {
    return { type: C.START_TO_RESPONSE_VIEW, sfid, rid, };
  },
  cancelToResponseView(sfid, rid) {
    return { type: C.CANCEL_TO_RESPONSE_VIEW, sfid, rid, };
  },
};

export default actions;
