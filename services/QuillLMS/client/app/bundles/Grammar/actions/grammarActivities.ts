import { pickBy } from 'lodash';
import { push } from 'react-router-redux';
import { GrammarActivity } from '../interfaces/grammarActivities';
import { GrammarActivityApi } from '../libs/grammar_activities_api';
import { ActionTypes } from './actionTypes';

export const startListeningToActivities = () => {
  return (dispatch: Function) => {
    GrammarActivityApi.getAll().then((activities) => {
      if (activities) {
        dispatch({ type: ActionTypes.RECEIVE_GRAMMAR_ACTIVITIES_DATA, data: activities, });
      } else {
        dispatch({ type: ActionTypes.NO_GRAMMAR_ACTIVITIES_FOUND })
      }
    });
  }
}

export const getActivity = (activityUID: string) => {
  return (dispatch: Function) => {
    GrammarActivityApi.get(activityUID).then((activity) => {
      if (activity) {
        dispatch({ type: ActionTypes.RECEIVE_GRAMMAR_ACTIVITY_DATA, data: activity, });
      } else {
        dispatch({ type: ActionTypes.NO_GRAMMAR_ACTIVITY_FOUND })
      }
    });
  }
}

export const toggleNewLessonModal = () => {
  return { type: ActionTypes.TOGGLE_NEW_LESSON_MODAL, };
}

export const submitNewLesson = (content: GrammarActivity) => {
  const cleanedContent = pickBy(content)
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.AWAIT_NEW_LESSON_RESPONSE, });
    GrammarActivityApi.create(content).then((activity) => {
      const lessonUid = Object.keys(lesson)[0];
      dispatch({ type: ActionTypes.RECEIVE_NEW_LESSON_RESPONSE, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      const action = push(`/admin/lessons/${lessonUid}`);
      dispatch(action);
      dispatch(startListeningToActivities());
    }).catch((error) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_LESSON_RESPONSE, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
    });
  };
}

export const startLessonEdit = (cid: string) => {
  return { type: ActionTypes.START_LESSON_EDIT, cid, };
}

export const cancelLessonEdit = (cid: string) => {
  return { type: ActionTypes.FINISH_LESSON_EDIT, cid, };
}

export const submitLessonEdit = (cid: string, content: GrammarActivity) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SUBMIT_LESSON_EDIT, cid, });
    const cleanedContent = pickBy(content)
    GrammarActivityApi.update(cid, content).then(() => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      dispatch(startListeningToActivities());
    }).catch((error) => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    });
  };
}

export const deleteLesson = (cid: string) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SUBMIT_LESSON_EDIT, cid, });
    GrammarActivityApi.remove(cid).then(() => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Lesson successfully deleted!', });
      const action = push(`/admin/lessons`)
      dispatch(action)
      dispatch(startListeningToActivities());
    }).catch((error) => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
    });
  };
}
