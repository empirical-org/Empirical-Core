import { Action } from "redux";
import ActionTypes from '../constants';
import { TitleCard } from '../interfaces/titleCard';

export interface TitleCardsReducerState {
  data: { [key:string]: TitleCard },
  hasreceiveddata: boolean
}

type TitleCardsReducerAction = Action & { data: TitleCard };


const initialState = {
  hasreceiveddata: false,
  data: {}
}

export default (
  currentState = initialState,
  action: TitleCardsReducerAction
) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_TITLE_CARDS_DATA:
      return Object.assign({}, currentState, {
        hasreceiveddata: true,
        data: action.data
      });
    default: return currentState || initialState;
  }
}
