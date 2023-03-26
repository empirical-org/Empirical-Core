import { ConceptFeedback } from '../interfaces/conceptsFeedback';
import { ConceptFeedbackApi } from '../libs/concept_feedback_api';
import { ActionTypes } from './actionTypes';

export const startListeningToConceptsFeedback = () => {
  return (dispatch: Function) => {
    dispatch(loadConceptsFeedback())
  };
}

export const loadConceptsFeedback = () => {
  return (dispatch: Function) => {
    ConceptFeedbackApi.getAll().then((data) => {
      dispatch({ type: ActionTypes.RECEIVE_CONCEPTS_FEEDBACK_DATA, data: data, });
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
    ConceptFeedbackApi.remove(cid).then(() => {
      dispatch({ type: ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'ConceptsFeedback successfully deleted!', });
      dispatch(loadConceptsFeedback())
    }).catch((error) => {
      dispatch({ type: ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
    })
  };
}

export const submitConceptsFeedbackEdit = (cid: string, content: ConceptFeedback) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SUBMIT_CONCEPTS_FEEDBACK_EDIT, cid, });
    ConceptFeedbackApi.update(cid, content).then(() => {
      dispatch({ type: ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      dispatch(loadConceptsFeedback())
    }).catch((error) => {
      dispatch({ type: ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    })
  };
}

export const toggleNewConceptsFeedbackModal = () => {
  return { type: ActionTypes.TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL, };
}

export const submitNewConceptsFeedback = (content: ConceptFeedback) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
    ConceptFeedbackApi.create(content).then((result) => {
      const UID = Object.keys(question)[0]
      dispatch({ type: ActionTypes.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      dispatch(loadConceptsFeedback())
    }).catch((error) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
    })
  };
}
