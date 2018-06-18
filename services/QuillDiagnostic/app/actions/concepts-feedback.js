const C = require('../constants').default;
import rootRef from '../libs/firebase';
const	feedbackRef = rootRef.child('concept-feedback');
import { push } from 'react-router-redux';

const actions = {
	// called when the app starts. this means we immediately download all quotes, and
	// then receive all quotes again as soon as anyone changes anything.
  startListeningToConceptsFeedback() {
    return function (dispatch, getState) {
      feedbackRef.on('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_CONCEPTS_FEEDBACK_DATA, data: snapshot.val(), });
      });
    };
  },
  loadConceptsFeedback() {
    return function (dispatch, getState) {
      feedbackRef.once('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_CONCEPTS_FEEDBACK_DATA, data: snapshot.val(), });
      });
    };
  },
  startConceptsFeedbackEdit(cid) {
    return { type: C.START_CONCEPTS_FEEDBACK_EDIT, cid, };
  },
  cancelConceptsFeedbackEdit(cid) {
    return { type: C.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, };
  },
  deleteConceptsFeedback(cid) {
    return function (dispatch, getState) {
      dispatch({ type: C.SUBMIT_CONCEPTS_FEEDBACK_EDIT, cid, });
      feedbackRef.child(cid).remove((error) => {
        dispatch({ type: C.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
        } else {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'ConceptsFeedback successfully deleted!', });
        }
      });
    };
  },
  submitConceptsFeedbackEdit(cid, content) {
    return function (dispatch, getState) {
      dispatch({ type: C.SUBMIT_CONCEPTS_FEEDBACK_EDIT, cid, });
      feedbackRef.child(cid).update(content, (error) => {
        dispatch({ type: C.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
        } else {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
        }
      });
    };
  },
  toggleNewConceptsFeedbackModal() {
    return { type: C.TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL, };
  },
  testFeedback() {
  },
  submitNewConceptsFeedback(content) {
    return function (dispatch, getState) {
      dispatch({ type: C.AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
      var newRef = feedbackRef.push(content, (error) => {
        dispatch({ type: C.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          const action = push(`/admin/concepts-feedback/${newRef.key}`);
          dispatch(action);
        }
      });
    };
  },
};

export default actions;
