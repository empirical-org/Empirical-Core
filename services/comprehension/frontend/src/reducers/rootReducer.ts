import { combineReducers } from "redux";
import { IState } from "../store/configStore";
import activities from './activitiesReducer'

export const initState: IState = {
  activities: {}
};

export const rootReducer = combineReducers({
  activities
});
