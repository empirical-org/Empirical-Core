import C from '../constants';
import _ from 'lodash';

const initialState = {
  titleCards: {
    hasreceiveddata: false,
    data: {} // this will contain firebase data
  }
}

export default function (currentstate, action) {
  switch (action.type) {
    case C.RECEIVE_TITLE_CARDS_DATA:
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data
      });
    default: return currentstate || initialState.titleCards;
  }
}
