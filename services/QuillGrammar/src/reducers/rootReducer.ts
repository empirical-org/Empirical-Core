import { combineReducers } from "redux";
import { IState } from "../store/configStore";
// import { todos } from "./todosReducer";
import grammarActivities from './grammarActivitiesReducer'
import session from './sessionReducer'
import questions from './questionsReducer'
import concepts from './conceptsReducer'
import display from './displayReducer'

export const initState: IState = {
    grammarActivities: {},
    session: {},
    questions: {},
    concepts: {},
    display : {}
};

export const rootReducer = combineReducers({
    grammarActivities,
    session,
    questions,
    concepts,
    display
});
