const C = require('../constants').default;
import { ConceptFeedbackApi, } from '../libs/concept_feedback_api.ts';
import { push } from 'react-router-redux';

const actions = {
  // called when the app starts. this means we immediately download all quotes, and
  // then receive all quotes again as soon as anyone changes anything.
  startListeningToConceptsFeedback() {
    return function (dispatch, getState) {
      dispatch(actions.loadConceptsFeedback())
    };
  },
  loadConceptsFeedback() {
    return function (dispatch, getState) {
      ConceptFeedbackApi.getAll().then((data) => {
        dispatch({ type: C.RECEIVE_CONCEPTS_FEEDBACK_DATA, data: data, });
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
      ConceptFeedbackApi.remove(cid).then(() => {
        dispatch({ type: C.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'ConceptsFeedback successfully deleted!', });
        dispatch(actions.loadConceptsFeedback())
      }).catch((error) => {
        dispatch({ type: C.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
        dispatch({ type: C.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
      })
    };
  },
  submitConceptsFeedbackEdit(cid, content) {
    return function (dispatch, getState) {
      dispatch({ type: C.SUBMIT_CONCEPTS_FEEDBACK_EDIT, cid, });
      ConceptFeedbackApi.update(cid, content).then(() => {
        dispatch({ type: C.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }).catch((error) => {
        dispatch({ type: C.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
        dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      })
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
      ConceptFeedbackApi.create(content).then((conceptFeedback) => {
        dispatch({ type: C.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        const uid = Object.keys(conceptFeedback)[0]
        const action = push(`/admin/concepts-feedback/${uid}`);
        dispatch(action);
      }).catch((error) => {
        dispatch({ type: C.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
        dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      })
    };
  },
};

export default actions;
