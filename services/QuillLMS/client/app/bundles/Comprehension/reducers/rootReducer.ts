import { combineReducers } from "redux";

import activities from './activitiesReducer'
import session from './sessionReducer'

import { IState } from "../store/configStore";

export const initState: IState = {
  activities: {},
  session: {}
};

export const rootReducer = combineReducers({
  activities,
  session
});
