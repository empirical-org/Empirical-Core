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

export const updateQuestions = (content, qids: Array<String>) => {
  return dispatch => {
    if (content.flag) {
      qids.forEach(qid => {
        dispatch(updateFlag(qid, content.flag))
      })
    }
  };
}

export const toggleNewLessonModal = () => {
  return { type: ActionTypes.TOGGLE_NEW_LESSON_MODAL, };
}

export const submitNewLesson = (content) => {
  const cleanedContent = _.pickBy(content)
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.AWAIT_NEW_LESSON_RESPONSE, });
    const newRef = lessonsRef.push(cleanedContent, (error) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_LESSON_RESPONSE, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else {
        const qids = cleanedContent.questions ? cleanedContent.questions.map(q => q.key) : []
        dispatch(updateQuestions(cleanedContent, qids))
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        const action = push(`/admin/lessons/${newRef.key}`);
        dispatch(action);
      }
    });
  };
}
