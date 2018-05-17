import { combineReducers } from "redux";
import { IState } from "../store/configStore";
// import { todos } from "./todosReducer";
import grammarActivities from './grammarActivitiesReducer'
import questions from './questionsReducer'

export const initState: IState = {
    grammarActivities: {},
    questions: {}
};

export const rootReducer = combineReducers({
    grammarActivities,
    questions
});
