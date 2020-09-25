import _ from 'lodash';

import C from '../constants';

const initialState = {
  diagnosticLessons: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}

export default function(currentstate,action){
    var newstate;
    switch(action.type){
      case C.RECEIVE_DIAGNOSTIC_LESSONS_DATA:
          return Object.assign({},currentstate,{
              hasreceiveddata: true,
              data: action.data
          });
      default: return currentstate || initialState.diagnosticLessons;
    }
}
