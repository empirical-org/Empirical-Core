import C from '../constants';
import { receiveQuestionsData } from './shared';

const initialState = {
  titleCards: {
    hasreceiveddata: false,
    data: {} // this will contain firebase data
  }
}

export default function (currentstate, action) {
  switch (action.type) {
    case C.RECEIVE_TITLE_CARDS_DATA:
      return receiveQuestionsData(currentstate, action)
    case C.RECEIVE_TITLE_CARDS_DATA_UPDATE:
      const updatedData = Object.assign({}, currentstate.data, action.data);
      return Object.assign({}, currentstate, {
        data: updatedData
      });
    default: return currentstate || initialState.titleCards;
  }
}
