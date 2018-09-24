import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const activitiesRef = rootRef.child('passageProofreadings')
import { ProofreaderActivities } from '../interfaces/proofreaderActivities'

export const startListeningToActivities = () => {
  return (dispatch:Function) => {
    activitiesRef.on('value', (snapshot:any) => {
      const activities: Array<ProofreaderActivities> = snapshot.val()
      if (activities) {
        dispatch({ type: ActionTypes.RECEIVE_PROOFREADER_ACTIVITIES_DATA, data: activities, });
      } else {
        dispatch({ type: ActionTypes.NO_PROOFREADER_ACTIVITIES_FOUND })
      }
    });

  }
}

export const startListeningToActivity = (activityUID: string) => {
  return (dispatch: Function) => {
    activitiesRef.child(activityUID).on('value', (snapshot: any) => {
      const activity: ProofreaderActivities = snapshot.val()
      if (activity) {
        dispatch({ type: ActionTypes.RECEIVE_PROOFREADER_ACTIVITY_DATA, data: activity, });
      } else {
        dispatch({ type: ActionTypes.NO_PROOFREADER_ACTIVITY_FOUND })
      }
    });

  }
}
