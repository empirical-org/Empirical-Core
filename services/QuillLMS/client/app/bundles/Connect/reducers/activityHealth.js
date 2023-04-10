import C from '../constants';

const initialState = {
  activityHealth: {
    flag: 'All Flags'
  }
};

export default function (currentstate, action) {

  let newstate;
  switch (action.type) {
    case C.SET_ACTIVITY_HEALTH_FLAG:
      return Object.assign({},currentstate,{
        flag: action.flag
      });
    default: return currentstate || initialState.activityHealth;
  }
}
