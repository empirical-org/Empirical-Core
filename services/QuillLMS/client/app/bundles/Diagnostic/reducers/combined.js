import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import { routerReducer } from 'react-router-redux';
import classroomLesson from './classroomLesson';
import classroomLessons from './classroomLessons'; // this is the admin one
import classroomLessonsReviews from './classroomLessonsReviews'
import classroomSessions from './classroomSessions';
import concepts from './concepts.ts';
import conceptsFeedback from './conceptsFeedback.ts';
import customize, * as FromCustomize from './customize'
import diagnosticQuestions from './diagnosticQuestions';
import display from './display';
import fillInBlank from './fillInBlank.ts';
import filters from './filtersReducer';
import generatedIncorrectSequences from './generatedIncorrectSequences';
import lessons from './lessons.ts';
import massEdit from './massEdit';
import pathways from './pathways';
import playDiagnostic from './diagnostics';
import playLesson from './questionReducer';
import question from './questionReducerV2';
import questions from './questions.ts';
import questionSelect from './questionSelect';
import responses from './responsesReducer';
import sentenceFragments from './sentenceFragments.ts';
import sessions from './sessions';
import titleCards from './titleCards.ts';
import connectSentenceCombining from './connectSentenceCombining';
import connectSentenceFragments from './connectSentenceFragments';
import connectFillInBlank from './connectFillInBlank';

const combinedReducers = combineReducers({
  classroomLesson,
  classroomLessons,
  classroomLessonsReviews,
  classroomSessions,
  concepts,
  conceptsFeedback,
  customize,
  diagnosticQuestions,
  display,
  fillInBlank,
  filters,
  generatedIncorrectSequences,
  lessons,
  massEdit,
  pathways,
  playDiagnostic,
  playLesson,
  question,
  questions,
  questionSelect,
  responses,
  routing: routerReducer,
  sentenceFragments,
  sessions,
  titleCards,
  connectSentenceCombining,
  connectSentenceFragments,
  connectFillInBlank
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
