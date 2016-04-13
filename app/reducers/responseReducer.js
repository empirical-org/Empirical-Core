import C from '../constants';
import _ from 'lodash';

const initialState = {
   sorting: "count",
   ascending: false,
   visibleStatuses: {
     "Optimal": true,
     "Sub-Optimal": true,
     "Common Error": true,
     "Unmatched": true
   },
   expanded: {}
}

export default function(currentState, action) {
   var newState;
   switch (action.type) {
      case C.TOGGLE_EXPAND_SINGLE_RESPONSE:
         debugger
         newState = _.cloneDeep(currentState);
         newState.expanded[action.rkey] = !currentState.expanded[action.rkey];
         return newState;
      default:
         return currentState || initialState;
   }
}

