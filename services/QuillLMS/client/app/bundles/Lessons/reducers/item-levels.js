import C from '../constants';
import _ from 'lodash';

const initialState = {
  itemLevels: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}

export default function(currentstate,action){
  let newstate;
  switch(action.type){
    case C.RECEIVE_ITEM_LEVELS_DATA:
      return Object.assign({},currentstate,{
        hasreceiveddata: true,
        data: action.data
      });
    case C.AWAIT_NEW_ITEM_LEVEL_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: true
      });
    case C.RECEIVE_NEW_ITEM_LEVEL_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: false,
        newConceptModalOpen: false
      });
    case C.START_ITEM_LEVEL_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.lid] = C.EDITING_ITEM_LEVEL;
      return newstate;
    case C.FINISH_ITEM_LEVEL_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.lid];
      return newstate;
    case C.SUBMIT_ITEM_LEVEL_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.lid] = C.SUBMITTING_ITEM_LEVEL;
      return newstate;
    case C.TOGGLE_NEW_ITEM_LEVEL_MODAL:
      return Object.assign({},currentstate,{
        newConceptModalOpen: !currentstate.newConceptModalOpen
      });
    default: return currentstate || initialState.itemLevels;
  }
};
