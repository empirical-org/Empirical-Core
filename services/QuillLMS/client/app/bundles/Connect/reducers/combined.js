import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import classroomLesson from './classroomLesson';
import classroomLessons from './classroomLessons'; // this is the admin one
import classroomLessonsReviews from './classroomLessonsReviews'
import classroomSessions from './classroomSessions';
import concepts from './concepts';
import conceptsFeedback from './concepts-feedback';
import customize, * as FromCustomize from './customize'
import display from './display';
import fillInBlank from './fillInBlank';
import filters from './filtersReducer';
import generatedIncorrectSequences from './generatedIncorrectSequences';
import itemLevels from './item-levels';
import lessons from './lessons';
import massEdit from './massEdit';
import pathways from './pathways';
import playLesson from './questionReducer';
import question from './questionReducerV2';
import questions from './questions';
import responses from './responsesReducer';
import sentenceFragments from './sentenceFragments';
import sessions from './sessions';
import titleCards from './titleCards';
import diagnosticLessons from './diagnosticLessons';
import playTurk from './turk';

import { SubmitActions } from '../actions';

const combinedReducers = combineReducers({
  classroomLesson,
  classroomLessons,
  classroomLessonsReviews,
  classroomSessions,
  concepts,
  conceptsFeedback,
  customize,
  display,
  fillInBlank,
  filters,
  generatedIncorrectSequences,
  itemLevels,
  lessons,
  massEdit,
  pathways,
  playLesson,
  question,
  questions,
  responses,
  routing: routerReducer,
  sentenceFragments,
  sessions,
  titleCards,
  diagnosticLessons,
  playTurk
});

export default combinedReducers;

export function getIncompleteQuestions(store) {
  return FromCustomize.getIncompleteQuestions(store['customize']);
}

export function getStoredEditionMetadata(store, props) {
  const editionId = props.params.editionID;
  const editions  = FromCustomize.getEditionMetadata(store['customize']);
  const edition   = editions[editionId];

  return editions[editionId];
}

export function getStoredEditionQuestions(store) {
  return FromCustomize.getEditionQuestions(store['customize']);
}
