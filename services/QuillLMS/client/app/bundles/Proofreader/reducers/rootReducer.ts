import { combineReducers } from "redux";

// import { todos } from "./todosReducer";
import proofreaderActivities from './proofreaderActivitiesReducer'
import session from './sessionReducer'
import concepts from './conceptsReducer'

import { IState } from "../store/configStore";

export const initState: IState = {
    proofreaderActivities: {},
    session: {}
};

export const rootReducer = combineReducers({
    proofreaderActivities,
    session,
    concepts
});
