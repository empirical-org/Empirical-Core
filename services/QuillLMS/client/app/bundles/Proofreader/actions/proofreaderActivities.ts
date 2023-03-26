import * as _ from 'lodash';
import { push } from 'react-router-redux';

import { ActionTypes } from './actionTypes';

import { ProofreaderActivity } from '../interfaces/proofreaderActivities';
import { ProofreaderPassageApi } from '../lib/proofreader_activities_api';

export const startListeningToActivities = () => {
  return (dispatch: Function) => {
    ProofreaderPassageApi.getAll().then((activities) => {
      if (activities) {
        dispatch({ type: ActionTypes.RECEIVE_PROOFREADER_ACTIVITIES_DATA, data: activities, });
      } else {
        dispatch({ type: ActionTypes.NO_PROOFREADER_ACTIVITIES_FOUND })
      }
    });
  }
}

export const getActivity = (activityUID: string) => {
  return (dispatch: Function) => {
    ProofreaderPassageApi.get(activityUID).then((activity) => {
      if (activity) {
        dispatch({ type: ActionTypes.RECEIVE_PROOFREADER_ACTIVITY_DATA, data: activity, });
      } else {
        dispatch({ type: ActionTypes.NO_PROOFREADER_ACTIVITY_FOUND })
      }
    });

  }
}

export const toggleLessonForm = (value?: boolean) => {
  return { type: ActionTypes.TOGGLE_LESSON_FORM, showForm: value };
}

export const submitNewLesson = (content: ProofreaderActivity) => {
  const cleanedContent = _.pickBy(content)
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.AWAIT_NEW_LESSON_RESPONSE, });
    ProofreaderPassageApi.create(cleanedContent).then((activity) => {
      const UID = Object.keys(question)[0];
      dispatch({ type: ActionTypes.RECEIVE_NEW_LESSON_RESPONSE, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      const action = push(`/admin/lessons/${UID}`);
      dispatch(action);
      dispatch(startListeningToActivities());
    }).catch((error) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_LESSON_RESPONSE, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
    })
  };
}

export const startLessonEdit = (cid: string) => {
  return { type: ActionTypes.START_LESSON_EDIT, cid, };
}

export const cancelLessonEdit = (cid: string) => {
  return { type: ActionTypes.FINISH_LESSON_EDIT, cid, };
}

export const submitLessonEdit = (cid: string, content: ProofreaderActivity) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SUBMIT_LESSON_EDIT, cid, });
    const cleanedContent = _.pickBy(content)
    ProofreaderPassageApi.update(cid, cleanedContent).then((activity) => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      dispatch(startListeningToActivities());
    }).catch((error) => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    })
  };
}

export const deleteLesson = (cid: string) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SUBMIT_LESSON_EDIT, cid, });
    ProofreaderPassageApi.remove(cid).then((result) => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Lesson successfully deleted!', });
      const action = push(`/admin/lessons`)
      dispatch(action)
      dispatch(startListeningToActivities());
    }).catch((error) => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
    })
  };
}
