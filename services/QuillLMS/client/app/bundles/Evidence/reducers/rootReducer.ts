import { combineReducers } from "redux";
import { IState } from "../store/configStore";
import activities from './activitiesReducer';
import session from './sessionReducer';

export const initState: IState = {
  activities: {},
  session: {}
};

export const rootReducer = combineReducers({
  activities,
  session
});
