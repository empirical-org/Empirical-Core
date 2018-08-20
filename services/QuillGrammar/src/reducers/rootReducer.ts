import { combineReducers } from "redux";
import { IState } from "../store/configStore";
// import { todos } from "./todosReducer";
import grammarActivities from './grammarActivitiesReducer'
import session from './sessionReducer'
import questions from './questionsReducer'
import concepts from './conceptsReducer'
import display from './displayReducer'
import responses from './responsesReducer'
import massEdit from './massEditReducer'
import filters from './filtersReducer'
import conceptsFeedback from './conceptsFeedbackReducer'

export const initState: IState = {
    grammarActivities: {},
    session: {},
    questions: {},
    concepts: {},
    display : {},
    responses: {},
    massEdit: {},
    filters: {},
    conceptsFeedback: {}
};

export const rootReducer = combineReducers({
    grammarActivities,
    session,
    questions,
    concepts,
    display,
    responses,
    massEdit,
    filters,
    conceptsFeedback
});
