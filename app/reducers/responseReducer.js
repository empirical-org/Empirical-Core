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

