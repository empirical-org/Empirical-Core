import { ConceptFeedback } from '../interfaces/conceptsFeedback'
import { ActionTypes } from './actionTypes'
import rootRef from '../firebase';
const	feedbackRef = rootRef.child('conceptsFeedback');
import { push } from 'react-router-redux';

	// called when the app starts. this means we immediately download all quotes, and
	// then receive all quotes again as soon as anyone changes anything.
export const startListeningToConceptsFeedback = () => {
  return (dispatch: Function) => {
    feedbackRef.on('value', (snapshot: any) => {
      dispatch({ type: ActionTypes.RECEIVE_CONCEPTS_FEEDBACK_DATA, data: snapshot.val(), });
    });
  };
}

export const loadConceptsFeedback = () => {
  return (dispatch: Function) => {
    feedbackRef.once('value', (snapshot: any) => {
      dispatch({ type: ActionTypes.RECEIVE_CONCEPTS_FEEDBACK_DATA, data: snapshot.val(), });
    });
  };
}

export const startConceptsFeedbackEdit = (cid: string) => {
  return { type: ActionTypes.START_CONCEPTS_FEEDBACK_EDIT, cid, };
}

export const cancelConceptsFeedbackEdit = (cid: string) => {
  return { type: ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, };
}

export const deleteConceptsFeedback = (cid: string) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SUBMIT_CONCEPTS_FEEDBACK_EDIT, cid, });
    feedbackRef.child(cid).remove((error: string) => {
      dispatch({ type: ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'ConceptsFeedback successfully deleted!', });
      }
    });
  };
}

export const submitConceptsFeedbackEdit = (cid: string, content: ConceptFeedback) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SUBMIT_CONCEPTS_FEEDBACK_EDIT, cid, });
    feedbackRef.child(cid).update(content, (error: string) => {
      dispatch({ type: ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }
    });
  };
}

export const toggleNewConceptsFeedbackModal = () => {
  return { type: ActionTypes.TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL, };
}

export const submitNewConceptsFeedback = (content: ConceptFeedback) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
    const newRef = feedbackRef.push(content, (error: string) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        const action = push(`/admin/concepts_feedback/${newRef.key}`);
        dispatch(action);
      }
    });
  };
}
