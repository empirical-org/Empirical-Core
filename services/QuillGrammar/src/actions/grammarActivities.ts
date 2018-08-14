import { push } from 'react-router-redux';
import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const activitiesRef = rootRef.child('grammarActivities')
import { GrammarActivities, GrammarActivity } from '../interfaces/grammarActivities'
import { updateFlag } from './questions'

export const startListeningToActivities = () => {
  return dispatch => {
    activitiesRef.on('value', (snapshot) => {
      const activities: Array<GrammarActivities> = snapshot.val()
      if (activities) {
        dispatch({ type: ActionTypes.RECEIVE_GRAMMAR_ACTIVITIES_DATA, data: activities, });
      } else {
        dispatch({ type: ActionTypes.NO_GRAMMAR_ACTIVITIES_FOUND })
      }
    });

  }
}

export const startListeningToActivity = (activityUID: string) => {
  return dispatch => {
    activitiesRef.child(activityUID).on('value', (snapshot) => {
      const activity: GrammarActivity = snapshot.val()
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

export const submitNewLesson = (content) => {
  console.log('content', content)
  const cleanedContent = _.pickBy(content)
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.AWAIT_NEW_LESSON_RESPONSE, });
    const newRef = activitiesRef.push(cleanedContent, (error) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_LESSON_RESPONSE, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        const action = push(`/admin/lessons/${newRef.key}`);
        dispatch(action);
      }
    });
  };
}

export const startLessonEdit = (cid) => {
  return { type: ActionTypes.START_LESSON_EDIT, cid, };
}

export const cancelLessonEdit = (cid) => {
  return { type: ActionTypes.FINISH_LESSON_EDIT, cid, };
}

export const submitLessonEdit = (cid, content) => {
  return function (dispatch, getState) {
    dispatch({ type: ActionTypes.SUBMIT_LESSON_EDIT, cid, });
    const cleanedContent = _.pickBy(content)
    activitiesRef.child(cid).set(cleanedContent, (error) => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }
    });
  };
}

export const deleteLesson = (cid) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SUBMIT_LESSON_EDIT, cid, });
    activitiesRef.child(cid).remove(error => {
      dispatch({ type: ActionTypes.FINISH_LESSON_EDIT, cid, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Lesson successfully deleted!', });
        const action = push(`/admin/lessons`)
        dispatch(action)
      }
    });
  };
}
