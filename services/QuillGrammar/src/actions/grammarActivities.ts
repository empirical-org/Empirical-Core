import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const activitiesRef = rootRef.child('grammarActivities')

export const startListeningToActivity = (activityUID: string) => {
  return function(dispatch) {
    activitiesRef.child(activityUID).on('value', (snapshot) => {
      dispatch({ type: ActionTypes.RECEIVE_GRAMMAR_ACTIVITY_DATA, data: snapshot.val(), });
  });

  }
}
