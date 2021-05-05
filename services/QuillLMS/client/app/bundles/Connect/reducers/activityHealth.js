import C from '../constants';
import _ from 'lodash';

const initialState = {
  activityHealth: {
    flag: 'All Flags'
  }
};

export default function (currentstate, action) {

  let newstate;
  switch (action.type) {
    case C.SET_ACTIVITY_HEALTH_FLAG:
      console.log("setting activity health flag in reducer")
      return Object.assign({},currentstate,{
        flag: action.flag
      });
    default: return currentstate || initialState.activityHealth;
  }
}
