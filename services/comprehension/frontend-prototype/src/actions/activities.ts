import { ActionTypes } from './actionTypes'
import { allActivities } from './dummy_data'

export const getActivity = (activityUID: string) => {
  return (dispatch: Function) => {
    const activity = allActivities.find(act => act.activity_id === Number(activityUID))
    if (activity) {
      dispatch({ type: ActionTypes.RECEIVE_ACTIVITY_DATA, data: activity, });
    } else {
      dispatch({ type: ActionTypes.NO_ACTIVITY_FOUND })
    }
  }
}
