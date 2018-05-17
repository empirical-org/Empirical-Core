import { combineReducers } from "redux";
import { IState } from "../store/configStore";
// import { todos } from "./todosReducer";
import grammarActivities from './grammarActivitiesReducer'

export const initState: IState = {
    // todos: [],
};

export const rootReducer = combineReducers({
    grammarActivities
});
