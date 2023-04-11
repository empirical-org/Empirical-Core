import { combineReducers } from "redux";
import { IState } from "../store/configStore";
// import { todos } from "./todosReducer";
import conceptsFeedback from './conceptsFeedbackReducer';
import concepts from './conceptsReducer';
import display from './displayReducer';
import filters from './filtersReducer';
import generatedIncorrectSequences from './generatedIncorrectSequencesReducer';
import grammarActivities from './grammarActivitiesReducer';
import massEdit from './massEditReducer';
import questionAndConceptMap from './questionAndConceptMapReducer';
import questions from './questionsReducer';
import responses from './responsesReducer';
import session from './sessionReducer';

export const initState: IState = {
  grammarActivities: {},
  session: {},
  questions: {},
  concepts: {},
  display : {},
  responses: {},
  massEdit: {},
  filters: {},
  conceptsFeedback: {},
  generatedIncorrectSequences: {},
  questionAndConceptMap: {}
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
  conceptsFeedback,
  generatedIncorrectSequences,
  questionAndConceptMap
});
