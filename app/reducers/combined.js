import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import question from './questionReducerV2';
import playLesson from './questionReducer';
import questions from './questions';
import diagnosticQuestions from './diagnosticQuestions';
import sentenceFragments from './sentenceFragments';
import questionSelect from './questionSelect';
import responses from './responsesReducer';
import concepts from './concepts';
import conceptsFeedback from './concepts-feedback';
import itemLevels from './item-levels';
import playDiagnostic from './diagnostics';
import lessons from './lessons';
import pathways from './pathways';
import scoreAnalysis from './scoreAnalysis';
import sessions from './sessions';
import filters from './filtersReducer';
import massEdit from './massEdit';
import fillInBlank from './fillInBlank';
import display from './display';
import classroomSessions from './classroomSessions';
import classroomLesson from './classroomLesson';
import classroomLessons from './classroomLessons'; // this is the admin one
import classroomLessonsReviews from './classroomLessonsReviews'
import customize from './customize'
import generatedIncorrectSequences from './generatedIncorrectSequences'
import { routerReducer } from 'react-router-redux';

const combinedReducers = combineReducers({
  question,
  classroomLesson,
  classroomLessons,
  classroomLessonsReviews,
  classroomSessions,
  concepts,
  conceptsFeedback,
  itemLevels,
  questions,
  responses,
  diagnosticQuestions,
  sentenceFragments,
  questionSelect,
  pathways,
  fillInBlank,
  filters,
  lessons,
  playLesson,
  playDiagnostic,
  scoreAnalysis,
  sessions,
  massEdit,
  display,
  customize,
  generatedIncorrectSequences,
  routing: routerReducer,
});

export default combinedReducers;
