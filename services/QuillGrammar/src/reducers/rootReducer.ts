import { combineReducers } from "redux";
import { IState } from "../store/configStore";
// import { todos } from "./todosReducer";
import grammarActivities from './grammarActivitiesReducer'
import session from './sessionReducer'
import questions from './questionsReducer'

export const initState: IState = {
    grammarActivities: {},
    session: {},
    questions: {}
};

export const rootReducer = combineReducers({
    grammarActivities,
    session,
    questions
});
