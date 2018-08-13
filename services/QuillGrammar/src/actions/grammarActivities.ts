import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const activitiesRef = rootRef.child('grammarActivities')
import { GrammarActivities, GrammarActivity } from '../interfaces/grammarActivities'

export const startListeningToActivities = () => {
  return (dispatch) => {
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
  return (dispatch) => {
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
