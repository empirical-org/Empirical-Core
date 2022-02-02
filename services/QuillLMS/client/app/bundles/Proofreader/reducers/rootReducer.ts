import { combineReducers } from "redux";
import { IState } from "../store/configStore";
// import { todos } from "./todosReducer";
import proofreaderActivities from './proofreaderActivitiesReducer'
import session from './sessionReducer'
import concepts from './conceptsReducer'

export const initState: IState = {
  proofreaderActivities: {},
  session: {}
};

export const rootReducer = combineReducers({
  proofreaderActivities,
  session,
  concepts
});
